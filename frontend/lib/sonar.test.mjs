import { test } from 'node:test'
import assert from 'node:assert/strict'
import { applyPicks, parseRss } from './sonar.mjs'

const pool = [{ title: 'a', blurb: 'A' }, { title: 'b', blurb: 'B' }, { title: 'c', blurb: 'C' }]

test('applyPicks keeps valid, unique indexes and drops invented ones', () => {
  const out = applyPicks(pool, [{ i: 2, why: 'x' }, { i: 9, why: 'fake' }, { i: 2, why: 'dup' }, { i: '1' }, { i: 0, why: 'y' }], 5)
  assert.deepEqual(out.map(o => [o.title, o.why]), [['c', 'x'], ['a', 'y']])
})

test('applyPicks falls back to the top of the pool when the model gives nothing usable', () => {
  assert.deepEqual(applyPicks(pool, undefined, 2).map(o => o.why), ['A', 'B'])
})

test('parseRss reads CDATA, decodes entities and filters by date', () => {
  const xml = `<rss><item><title><![CDATA[Acme raises $5M &amp; more]]></title><link>https://x.com/a</link><pubDate>Mon, 19 Oct 2026 10:00:00 +0000</pubDate><description><![CDATA[<p>Seed round</p>]]></description></item>
  <item><title>Old</title><link>https://x.com/b</link><pubDate>Mon, 01 Jan 2024 10:00:00 +0000</pubDate></item></rss>`
  assert.deepEqual(parseRss(xml, new Date('2026-10-14')).map(i => [i.title, i.blurb]), [['Acme raises $5M & more', 'Seed round']])
})
