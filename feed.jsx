import { useState } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Zen+Kaku+Gothic+New:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --night:    #080609;
  --night2:   #0f0b10;
  --night3:   #161220;
  --night4:   #1e192a;
  --night5:   #251f32;
  --sakura:   #e8607a;
  --sakura2:  #f092a5;
  --sakura3:  #fcd0d8;
  --sk-g:     rgba(232,96,122,0.13);
  --sk-g2:    rgba(232,96,122,0.06);
  --gold:     #c9a84c;
  --gold2:    #e8d08a;
  --gold-g:   rgba(201,168,76,0.1);
  --indigo:   #6c8ef5;
  --indigo-g: rgba(108,142,245,0.1);
  --green:    #4ecb8d;
  --green-g:  rgba(78,203,141,0.1);
  --white:    #fdf4f6;
  --white2:   #e8d8dc;
  --muted:    #7a6070;
  --muted2:   #4a3848;
  --border:   rgba(232,96,122,0.14);
  --border2:  rgba(253,244,246,0.07);
  --font-d: 'Shippori Mincho', serif;
  --font-b: 'Cormorant Garamond', serif;
  --font-u: 'Zen Kaku Gothic New', sans-serif;
}

body {
  background: var(--night);
  color: var(--white);
  font-family: var(--font-b);
  font-size: 14px;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── TOPBAR ── */
.topbar {
  position: sticky;
  top: 0;
  z-index: 200;
  background: rgba(8,6,9,0.95);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 0;
}

.topbar-logo {
  font-family: var(--font-d);
  font-size: 22px;
  font-weight: 700;
  color: var(--white);
  letter-spacing: 0.04em;
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-right: 24px;
  flex-shrink: 0;
}

.logo-kanji {
  font-size: 12px;
  color: var(--sakura);
  letter-spacing: 0.14em;
  opacity: 0.85;
}

.topbar-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--night3);
  border: 1px solid var(--border2);
  padding: 6px 14px;
  flex: 1;
  max-width: 380px;
  transition: border-color 0.2s;
}

.topbar-search:focus-within { border-color: var(--border); }

.topbar-search input {
  background: none;
  border: none;
  outline: none;
  color: var(--white);
  font-family: var(--font-b);
  font-size: 14px;
  font-style: italic;
  width: 100%;
}

.topbar-search input::placeholder { color: var(--muted2); }

.search-icon { color: var(--muted); font-size: 13px; }

.topbar-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
}

.topbar-icon-btn {
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  background: var(--night3);
  border: 1px solid var(--border2);
  color: var(--muted);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
}

.topbar-icon-btn:hover { border-color: var(--border); color: var(--white); }

.notif-dot {
  position: absolute;
  top: 7px; right: 7px;
  width: 5px; height: 5px;
  background: var(--sakura);
  border-radius: 50%;
  box-shadow: 0 0 5px var(--sakura);
}

.topbar-avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2a1520, #0f0a14);
  border: 1.5px solid var(--sakura);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-d);
  font-size: 13px;
  color: var(--sakura);
  cursor: pointer;
  margin-left: 4px;
  flex-shrink: 0;
}

/* ── LAYOUT ── */
.layout {
  display: grid;
  grid-template-columns: 220px 1fr 240px;
  gap: 0;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 52px);
  align-items: start;
}

/* ── SIDEBAR LEFT ── */
.sidebar-left {
  border-right: 1px solid var(--border);
  padding: 20px 0;
  position: sticky;
  top: 52px;
  height: calc(100vh - 52px);
  overflow-y: auto;
  scrollbar-width: none;
}
.sidebar-left::-webkit-scrollbar { display: none; }

.sidebar-section { margin-bottom: 6px; }

.sidebar-section-label {
  font-family: var(--font-u);
  font-size: 9px;
  font-weight: 300;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted2);
  padding: 8px 20px 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 20px;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
  font-family: var(--font-u);
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.05em;
  color: var(--muted);
}

.nav-item:hover { background: var(--night3); color: var(--white2); }

.nav-item.active {
  color: var(--sakura2);
  background: var(--sk-g2);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 2px;
  background: var(--sakura);
}

.nav-icon { font-size: 15px; width: 18px; text-align: center; flex-shrink: 0; }

.nav-badge {
  margin-left: auto;
  background: var(--sakura);
  color: var(--night);
  font-family: var(--font-u);
  font-size: 9px;
  font-weight: 500;
  padding: 1px 5px;
  border-radius: 10px;
}

.sidebar-divider {
  height: 1px;
  background: var(--border);
  margin: 10px 20px;
}

/* mini profile */
.mini-profile {
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 8px;
}

.mini-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2a1520, #0f0a14);
  border: 1.5px solid var(--sakura);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-d);
  font-size: 14px;
  color: var(--sakura);
  flex-shrink: 0;
}

.mini-info { flex: 1; min-width: 0; }

.mini-name {
  font-family: var(--font-d);
  font-size: 13px;
  font-weight: 700;
  color: var(--white);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-pseudo {
  font-family: var(--font-b);
  font-style: italic;
  font-size: 11px;
  color: var(--sakura);
  opacity: 0.8;
}

/* ── MAIN FEED ── */
.feed-main {
  border-right: 1px solid var(--border);
  min-height: calc(100vh - 52px);
}

/* ── STORIES ── */
.stories-bar {
  border-bottom: 1px solid var(--border);
  padding: 14px 20px;
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scrollbar-width: none;
  background: var(--night2);
}
.stories-bar::-webkit-scrollbar { display: none; }

.story-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.story-item:hover { transform: translateY(-2px); }

.story-ring {
  width: 52px; height: 52px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, var(--sakura), var(--gold));
  position: relative;
}

.story-ring.seen {
  background: linear-gradient(135deg, var(--muted2), var(--night4));
}

.story-ring.add-new {
  background: var(--night4);
  border: 1.5px dashed var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  color: var(--muted);
}

.story-avatar {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #2a1520, #0f0a14);
  border: 2px solid var(--night2);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-d);
  font-size: 16px;
  color: var(--sakura2);
}

.story-label {
  font-family: var(--font-u);
  font-size: 9px;
  font-weight: 300;
  letter-spacing: 0.06em;
  color: var(--muted);
  text-align: center;
  max-width: 52px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── COMPOSER BAR ── */
.composer-bar {
  border-bottom: 1px solid var(--border);
  padding: 14px 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--night2);
}

.composer-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2a1520, #0f0a14);
  border: 1.5px solid var(--sakura);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-d);
  font-size: 13px;
  color: var(--sakura);
  flex-shrink: 0;
}

.composer-right { flex: 1; }

.composer-textarea {
  width: 100%;
  background: var(--night4);
  border: 1px solid var(--border2);
  padding: 10px 14px;
  color: var(--white);
  font-family: var(--font-b);
  font-size: 15px;
  font-style: italic;
  font-weight: 300;
  outline: none;
  resize: none;
  line-height: 1.6;
  min-height: 56px;
  transition: border-color 0.2s, min-height 0.2s;
}

.composer-textarea::placeholder { color: var(--muted2); }
.composer-textarea:focus {
  border-color: var(--border);
  min-height: 80px;
}

.composer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.composer-types {
  display: flex;
  gap: 4px;
}

.type-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: var(--night5);
  border: 1px solid var(--border2);
  color: var(--muted);
  font-family: var(--font-u);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.15s;
}

.type-btn:hover, .type-btn.active {
  border-color: var(--border);
  color: var(--sakura2);
  background: var(--sk-g2);
}

.btn-publish {
  background: var(--sakura);
  color: var(--night);
  border: none;
  padding: 7px 20px;
  font-family: var(--font-u);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-publish:hover {
  background: var(--sakura2);
  box-shadow: 0 4px 16px rgba(232,96,122,0.3);
}

/* ── FEED TABS ── */
.feed-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  background: var(--night2);
  position: sticky;
  top: 52px;
  z-index: 10;
}

.feed-tab {
  flex: 1;
  padding: 11px 10px;
  text-align: center;
  font-family: var(--font-u);
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.feed-tab:hover { color: var(--white2); }
.feed-tab.active { color: var(--sakura2); border-bottom-color: var(--sakura); }

/* ── POSTS ── */
.post {
  border-bottom: 1px solid var(--border);
  padding: 18px 20px;
  transition: background 0.12s;
  animation: postIn 0.3s ease both;
  position: relative;
}

.post:hover { background: rgba(15,11,16,0.6); }

@keyframes postIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.post-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

.post-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  border: 1.5px solid;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-d);
  font-size: 14px;
  font-style: italic;
  flex-shrink: 0;
  cursor: pointer;
  transition: opacity 0.15s;
}

.post-avatar:hover { opacity: 0.8; }

.post-meta { flex: 1; min-width: 0; }

.post-author {
  font-family: var(--font-d);
  font-weight: 700;
  font-size: 14px;
  color: var(--white);
  cursor: pointer;
  transition: color 0.15s;
}

.post-author:hover { color: var(--sakura2); }

.post-pseudo {
  font-family: var(--font-b);
  font-style: italic;
  font-size: 11px;
  color: var(--sakura);
  opacity: 0.75;
  margin-left: 6px;
}

.post-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  flex-wrap: wrap;
}

.post-time {
  font-family: var(--font-u);
  font-size: 10px;
  font-weight: 300;
  color: var(--muted);
  letter-spacing: 0.04em;
}

.post-community-tag {
  font-family: var(--font-u);
  font-size: 10px;
  font-weight: 300;
  color: var(--indigo);
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: opacity 0.15s;
}
.post-community-tag:hover { opacity: 0.8; }

.discovery-tag {
  font-family: var(--font-u);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
  background: var(--gold-g);
  border: 1px solid rgba(201,168,76,0.2);
  padding: 1px 6px;
}

.post-type-badge {
  font-family: var(--font-u);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 2px 7px;
  border: 1px solid;
}

.badge-text    { color: var(--white2); border-color: var(--border2); }
.badge-excerpt { color: var(--gold);   border-color: rgba(201,168,76,0.3); background: var(--gold-g); }
.badge-poem    { color: var(--sakura2); border-color: var(--border); background: var(--sk-g2); }
.badge-chapter { color: var(--green);  border-color: rgba(78,203,141,0.3); background: var(--green-g); }
.badge-question{ color: var(--indigo); border-color: rgba(108,142,245,0.3); background: var(--indigo-g); }

.post-more {
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 16px;
  padding: 2px 6px;
  transition: color 0.15s;
  margin-left: auto;
}
.post-more:hover { color: var(--white2); }

/* ── POST BODIES ── */
.post-body-text {
  font-family: var(--font-b);
  font-size: 16px;
  font-weight: 300;
  color: var(--white2);
  line-height: 1.75;
  margin-bottom: 10px;
}

/* EXCERPT */
.post-body-excerpt {
  position: relative;
  background: linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(8,6,9,0) 100%);
  border: 1px solid rgba(201,168,76,0.18);
  padding: 18px 20px 18px 24px;
  margin-bottom: 10px;
}

.post-body-excerpt::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, var(--gold), transparent);
}

.excerpt-label {
  font-family: var(--font-u);
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0.7;
  margin-bottom: 10px;
  display: block;
}

.excerpt-text {
  font-family: var(--font-b);
  font-style: italic;
  font-size: 17px;
  font-weight: 300;
  color: var(--white);
  line-height: 1.8;
  margin-bottom: 10px;
}

.excerpt-work {
  font-family: var(--font-d);
  font-size: 12px;
  font-weight: 600;
  color: var(--gold2);
  opacity: 0.8;
}

/* POEM */
.post-body-poem {
  position: relative;
  padding: 20px 24px;
  margin-bottom: 10px;
  text-align: center;
}

.post-body-poem::before,
.post-body-poem::after {
  content: '';
  position: absolute;
  left: 50%; transform: translateX(-50%);
  width: 40px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--sakura), transparent);
}

.post-body-poem::before { top: 0; }
.post-body-poem::after  { bottom: 0; }

.poem-text {
  font-family: var(--font-b);
  font-style: italic;
  font-size: 17px;
  font-weight: 300;
  color: var(--white);
  line-height: 2;
  white-space: pre-line;
}

.poem-kanji {
  font-family: var(--font-d);
  font-size: 28px;
  color: var(--sakura);
  opacity: 0.08;
  position: absolute;
  top: 12px; right: 16px;
  line-height: 1;
}

/* CHAPTER */
.post-body-chapter {
  border: 1px solid rgba(78,203,141,0.18);
  background: var(--green-g);
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
  margin-bottom: 10px;
}

.post-body-chapter:hover { border-color: rgba(78,203,141,0.4); }

.chapter-icon {
  font-size: 28px;
  flex-shrink: 0;
  opacity: 0.8;
}

.chapter-info { flex: 1; }

.chapter-work {
  font-family: var(--font-d);
  font-size: 15px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 3px;
}

.chapter-title {
  font-family: var(--font-b);
  font-style: italic;
  font-size: 13px;
  color: var(--green);
  opacity: 0.85;
}

.chapter-meta {
  font-family: var(--font-u);
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.06em;
  margin-top: 4px;
}

.chapter-arrow {
  font-size: 18px;
  color: var(--green);
  opacity: 0.5;
}

/* QUESTION */
.post-body-question {
  border: 1px solid rgba(108,142,245,0.2);
  background: var(--indigo-g);
  padding: 16px 18px;
  margin-bottom: 10px;
}

.question-label {
  font-family: var(--font-u);
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--indigo);
  opacity: 0.7;
  margin-bottom: 8px;
  display: block;
}

.question-text {
  font-family: var(--font-d);
  font-size: 17px;
  font-weight: 600;
  color: var(--white);
  line-height: 1.4;
}

/* ── POST TAGS ── */
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}

.post-tag {
  font-family: var(--font-u);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.06em;
  color: var(--muted);
  background: var(--night4);
  border: 1px solid var(--border2);
  padding: 2px 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.post-tag:hover { color: var(--sakura2); border-color: var(--border); }

/* ── POST ACTIONS ── */
.post-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.post-action {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: none;
  border: none;
  color: var(--muted);
  font-family: var(--font-u);
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.15s;
}

.post-action:hover { color: var(--sakura2); background: var(--sk-g2); }
.post-action.liked { color: var(--sakura); }
.post-action.bookmarked { color: var(--gold); }

.action-icon { font-size: 14px; }

.action-divider {
  width: 1px;
  height: 14px;
  background: var(--border2);
  margin: 0 4px;
}

/* ── SIDEBAR RIGHT ── */
.sidebar-right {
  padding: 20px 0;
  position: sticky;
  top: 52px;
  height: calc(100vh - 52px);
  overflow-y: auto;
  scrollbar-width: none;
}
.sidebar-right::-webkit-scrollbar { display: none; }

.widget {
  border-bottom: 1px solid var(--border);
  padding: 16px 18px;
}

.widget-title {
  font-family: var(--font-d);
  font-size: 13px;
  font-weight: 700;
  color: var(--white2);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.widget-title::before {
  content: '';
  width: 2px; height: 13px;
  background: var(--sakura);
  flex-shrink: 0;
}

/* online writers */
.online-list { display: flex; flex-direction: column; gap: 10px; }

.online-item {
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  transition: opacity 0.15s;
}

.online-item:hover { opacity: 0.8; }

.online-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1.5px solid;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-d);
  font-size: 11px;
  flex-shrink: 0;
  position: relative;
}

.online-pip {
  position: absolute;
  bottom: 0; right: 0;
  width: 8px; height: 8px;
  background: var(--green);
  border-radius: 50%;
  border: 1.5px solid var(--night);
  box-shadow: 0 0 5px var(--green);
}

.online-info { flex: 1; min-width: 0; }

.online-name {
  font-family: var(--font-d);
  font-size: 12px;
  font-weight: 600;
  color: var(--white);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.online-status {
  font-family: var(--font-b);
  font-style: italic;
  font-size: 11px;
  color: var(--muted);
}

/* trending tags */
.tag-list { display: flex; flex-direction: column; gap: 6px; }

.trending-tag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 4px 0;
  transition: opacity 0.15s;
}

.trending-tag:hover { opacity: 0.8; }

.tag-name {
  font-family: var(--font-u);
  font-size: 12px;
  font-weight: 300;
  color: var(--sakura2);
  letter-spacing: 0.05em;
}

.tag-count {
  font-family: var(--font-u);
  font-size: 10px;
  font-weight: 300;
  color: var(--muted);
  letter-spacing: 0.06em;
}

/* suggested communities */
.comm-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px solid var(--border2);
  cursor: pointer;
  transition: opacity 0.15s;
}

.comm-item:last-child { border-bottom: none; }
.comm-item:hover { opacity: 0.8; }

.comm-emoji { font-size: 22px; flex-shrink: 0; filter: saturate(0.7); }

.comm-info { flex: 1; }

.comm-name {
  font-family: var(--font-d);
  font-size: 12px;
  font-weight: 700;
  color: var(--white);
}

.comm-count {
  font-family: var(--font-u);
  font-size: 10px;
  font-weight: 300;
  color: var(--muted);
  letter-spacing: 0.05em;
}

.btn-join {
  background: none;
  border: 1px solid var(--border);
  color: var(--sakura2);
  font-family: var(--font-u);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 10px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-join:hover { background: var(--sk-g); border-color: var(--sakura); }
.btn-join.joined { color: var(--muted); border-color: var(--border2); }

/* writer of the day */
.wotd {
  text-align: center;
  padding: 4px 0 8px;
}

.wotd-avatar {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2a1520, #0f0a14);
  border: 2px solid var(--gold);
  margin: 0 auto 8px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-d);
  font-size: 20px;
  font-style: italic;
  color: var(--gold);
  box-shadow: 0 0 16px rgba(201,168,76,0.2);
}

.wotd-name {
  font-family: var(--font-d);
  font-size: 14px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 2px;
}

.wotd-pseudo {
  font-family: var(--font-b);
  font-style: italic;
  font-size: 12px;
  color: var(--gold);
  opacity: 0.8;
  margin-bottom: 6px;
}

.wotd-bio {
  font-family: var(--font-b);
  font-style: italic;
  font-size: 12px;
  color: var(--muted);
  line-height: 1.6;
}

.see-more {
  display: block;
  text-align: center;
  padding: 8px;
  font-family: var(--font-b);
  font-style: italic;
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.15s;
  border-top: 1px solid var(--border2);
  margin-top: 8px;
}
.see-more:hover { color: var(--sakura2); }
`;

// ── DATA ──
const POSTS_DATA = [
  {
    id: 1,
    author: "Yuki Hoshida",
    pseudo: "lua-errante",
    initials: "Y",
    avatarBg: "#1a0f2a",
    avatarColor: "#c9b46a",
    time: "há 12 min",
    community: "Poesia Noturna",
    type: "poem",
    badge: "badge-poem",
    badgeLabel: "Poema",
    discovery: false,
    content: `a janela me devolve
um rosto que não reconheço
— ainda bem`,
    kanji: "詩",
    tags: ["haiku", "identidade", "noite"],
    likes: 87, comments: 14, bookmarks: 23,
    liked: false, bookmarked: false,
  },
  {
    id: 2,
    author: "Marcos Villareal",
    pseudo: null,
    initials: "M",
    avatarBg: "#0a1a0a",
    avatarColor: "#4ecb8d",
    time: "há 34 min",
    community: "Ficção Científica BR",
    type: "chapter",
    badge: "badge-chapter",
    badgeLabel: "Capítulo",
    discovery: true,
    workTitle: "O Último Arquivista",
    chapterTitle: "Capítulo 9 — A Sala das Memórias Proibidas",
    chapterMeta: "4.200 palavras · Leitura de ~18 min",
    tags: ["ficção-científica", "distopia", "memória"],
    likes: 142, comments: 31, bookmarks: 57,
    liked: false, bookmarked: true,
  },
  {
    id: 3,
    author: "Ren The Writer",
    pseudo: "ren-the-writer",
    initials: "R",
    avatarBg: "#2a0f1a",
    avatarColor: "#e8607a",
    time: "há 1h",
    community: null,
    type: "text",
    badge: "badge-text",
    badgeLabel: "Texto",
    discovery: false,
    content: "Às vezes a melhor cena do capítulo é aquela que você escreve às 2h da manhã sem planejamento nenhum. O personagem simplesmente... decidiu. E você só acompanhou. 🌙",
    tags: ["processo-criativo", "escrita-espontânea"],
    likes: 204, comments: 38, bookmarks: 12,
    liked: true, bookmarked: false,
  },
  {
    id: 4,
    author: "Lyra Voss",
    pseudo: "lyra-das-sombras",
    initials: "L",
    avatarBg: "#1a0a2a",
    avatarColor: "#b464ff",
    time: "há 2h",
    community: "Contos Sombrios",
    type: "excerpt",
    badge: "badge-excerpt",
    badgeLabel: "Trecho",
    discovery: true,
    excerpt: "Ela havia aprendido a sorrir de um jeito que não chegava aos olhos — e ninguém nunca tinha percebido. Isso, concluiu, era tanto uma tragédia quanto uma habilidade.",
    workTitle: "A Arte de Parecer Inteira",
    tags: ["conto", "psicológico", "personagem"],
    likes: 318, comments: 52, bookmarks: 94,
    liked: false, bookmarked: false,
  },
  {
    id: 5,
    author: "Aiko Sato",
    pseudo: "aiko-escreve",
    initials: "A",
    avatarBg: "#1a1a0a",
    avatarColor: "#c9a84c",
    time: "há 3h",
    community: "Discussão Literária",
    type: "question",
    badge: "badge-question",
    badgeLabel: "Pergunta",
    discovery: false,
    question: "Vocês preferem POV único ou múltiplos pontos de vista no mesmo livro? Por quê?",
    tags: ["discussão", "técnica-narrativa"],
    likes: 67, comments: 89, bookmarks: 8,
    liked: false, bookmarked: false,
  },
];

const ONLINE = [
  { name: "Yuki H.", pseudo: "lua-errante", initials: "Y", bg: "#1a0f2a", color: "#c9b46a", status: "escrevendo um poema" },
  { name: "Camila N.", pseudo: null, initials: "C", bg: "#2a0a0a", color: "#f092a5", status: "revisando capítulo 3" },
  { name: "Pedro L.", pseudo: "p-escreve", initials: "P", bg: "#0a0f2a", color: "#6c8ef5", status: "lendo na comunidade" },
  { name: "Aiko S.", pseudo: "aiko-escreve", initials: "A", bg: "#1a1a0a", color: "#c9a84c", status: "respondendo perguntas" },
];

const TRENDING = [
  { tag: "#poesia-noturna", count: "2.4k posts" },
  { tag: "#haiku-moderno", count: "1.1k posts" },
  { tag: "#ficção-científica", count: "987 posts" },
  { tag: "#processo-criativo", count: "743 posts" },
  { tag: "#conto-psicológico", count: "521 posts" },
];

const COMMUNITIES = [
  { emoji: "🌙", name: "Poesia Noturna", count: "1.204 escritores" },
  { emoji: "🗡️", name: "Fantasia & Magia", count: "3.891 escritores" },
  { emoji: "✒️", name: "Contos Sombrios", count: "2.107 escritores" },
];

const STORIES = [
  { label: "Você", initials: "+", isAdd: true },
  { label: "Yuki H.", initials: "Y", bg: "#1a0f2a", color: "#c9b46a", seen: false },
  { label: "Lyra V.", initials: "L", bg: "#1a0a2a", color: "#b464ff", seen: false },
  { label: "Marcos V.", initials: "M", bg: "#0a1a0a", color: "#4ecb8d", seen: true },
  { label: "Aiko S.", initials: "A", bg: "#1a1a0a", color: "#c9a84c", seen: false },
  { label: "Pedro L.", initials: "P", bg: "#0a0f2a", color: "#6c8ef5", seen: true },
  { label: "Camila N.", initials: "C", bg: "#2a0a0a", color: "#f092a5", seen: false },
];

const NAV_ITEMS = [
  { icon: "🏠", label: "Feed", key: "feed", badge: null },
  { icon: "🔍", label: "Explorar", key: "explore", badge: null },
  { icon: "🏘️", label: "Comunidades", key: "comm", badge: "3" },
  { icon: "✉️", label: "Recados", key: "scraps", badge: "5" },
  { icon: "💬", label: "Mensagens", key: "msgs", badge: "2" },
  { icon: "📚", label: "Minhas Obras", key: "works", badge: null },
  { icon: "⭐", label: "Favoritos", key: "favs", badge: null },
  { icon: "🏆", label: "Conquistas", key: "achiev", badge: null },
];

export default function KakuFeed() {
  const [activeNav, setActiveNav] = useState("feed");
  const [activeTab, setActiveTab] = useState("misto");
  const [activeType, setActiveType] = useState("texto");
  const [posts, setPosts] = useState(POSTS_DATA);
  const [joined, setJoined] = useState({});
  const [draft, setDraft] = useState("");
  const [newPost, setNewPost] = useState(false);

  function toggleLike(id) {
    setPosts(p => p.map(post =>
      post.id === id
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  }

  function toggleBookmark(id) {
    setPosts(p => p.map(post =>
      post.id === id
        ? { ...post, bookmarked: !post.bookmarked, bookmarks: post.bookmarked ? post.bookmarks - 1 : post.bookmarks + 1 }
        : post
    ));
  }

  function handlePublish() {
    if (!draft.trim()) return;
    const p = {
      id: Date.now(),
      author: "Ren The Writer",
      pseudo: "ren-the-writer",
      initials: "R",
      avatarBg: "#2a0f1a",
      avatarColor: "#e8607a",
      time: "agora mesmo",
      community: null,
      type: "text",
      badge: "badge-text",
      badgeLabel: "Texto",
      discovery: false,
      content: draft,
      tags: [],
      likes: 0, comments: 0, bookmarks: 0,
      liked: false, bookmarked: false,
    };
    setPosts([p, ...posts]);
    setDraft("");
    setNewPost(true);
    setTimeout(() => setNewPost(false), 2000);
  }

  return (
    <>
      <style>{CSS}</style>

      {/* TOPBAR */}
      <header className="topbar">
        <div className="topbar-logo">
          Kaku <span className="logo-kanji">書く</span>
        </div>

        <div className="topbar-search">
          <span className="search-icon">⌕</span>
          <input placeholder="buscar escritores, obras, comunidades…" />
        </div>

        <div className="topbar-right">
          <div className="topbar-icon-btn">
            🔔
            <span className="notif-dot" />
          </div>
          <div className="topbar-icon-btn">✉️</div>
          <div className="topbar-icon-btn">⚙️</div>
          <div className="topbar-avatar">R</div>
        </div>
      </header>

      <div className="layout">

        {/* ── SIDEBAR LEFT ── */}
        <aside className="sidebar-left">
          <div className="mini-profile">
            <div className="mini-avatar">R</div>
            <div className="mini-info">
              <div className="mini-name">Naoto Tanaka</div>
              <div className="mini-pseudo">✦ Ren The Writer</div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">Navegar</div>
            {NAV_ITEMS.slice(0,4).map(n => (
              <div
                key={n.key}
                className={`nav-item ${activeNav === n.key ? "active" : ""}`}
                onClick={() => setActiveNav(n.key)}
              >
                <span className="nav-icon">{n.icon}</span>
                {n.label}
                {n.badge && <span className="nav-badge">{n.badge}</span>}
              </div>
            ))}
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-section">
            <div className="sidebar-section-label">Escrever</div>
            {NAV_ITEMS.slice(4).map(n => (
              <div
                key={n.key}
                className={`nav-item ${activeNav === n.key ? "active" : ""}`}
                onClick={() => setActiveNav(n.key)}
              >
                <span className="nav-icon">{n.icon}</span>
                {n.label}
                {n.badge && <span className="nav-badge">{n.badge}</span>}
              </div>
            ))}
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-section">
            <div className="sidebar-section-label">Minhas Comunidades</div>
            {[
              { emoji: "🌙", label: "Poesia Noturna" },
              { emoji: "⛩️", label: "Fantasia Oriental" },
              { emoji: "✒️", label: "Contos Sombrios" },
            ].map((c, i) => (
              <div key={i} className="nav-item">
                <span className="nav-icon">{c.emoji}</span>
                {c.label}
              </div>
            ))}
          </div>
        </aside>

        {/* ── FEED CENTER ── */}
        <main className="feed-main">

          {/* Stories */}
          <div className="stories-bar">
            {STORIES.map((s, i) => (
              <div key={i} className="story-item">
                {s.isAdd ? (
                  <div className="story-ring add-new">+</div>
                ) : (
                  <div className={`story-ring ${s.seen ? "seen" : ""}`}>
                    <div className="story-avatar" style={{ background: `linear-gradient(135deg, ${s.bg}, #080609)`, color: s.color }}>
                      {s.initials}
                    </div>
                  </div>
                )}
                <span className="story-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="composer-bar">
            <div className="composer-avatar">R</div>
            <div className="composer-right">
              <textarea
                className="composer-textarea"
                placeholder="O que você está escrevendo hoje?"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                rows={2}
              />
              <div className="composer-footer">
                <div className="composer-types">
                  {[
                    { key: "texto", icon: "✍️", label: "Texto" },
                    { key: "trecho", icon: "📖", label: "Trecho" },
                    { key: "poema", icon: "🌸", label: "Poema" },
                    { key: "pergunta", icon: "❓", label: "Pergunta" },
                  ].map(t => (
                    <button
                      key={t.key}
                      className={`type-btn ${activeType === t.key ? "active" : ""}`}
                      onClick={() => setActiveType(t.key)}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
                <button className="btn-publish" onClick={handlePublish}>
                  {newPost ? "🌸 Publicado!" : "Publicar"}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="feed-tabs">
            {[
              { key: "misto", label: "Para você" },
              { key: "seguindo", label: "Seguindo" },
              { key: "descoberta", label: "Descoberta" },
            ].map(t => (
              <div
                key={t.key}
                className={`feed-tab ${activeTab === t.key ? "active" : ""}`}
                onClick={() => setActiveTab(t.key)}
              >{t.label}</div>
            ))}
          </div>

          {/* Posts */}
          {posts.map((post, idx) => (
            <article key={post.id} className="post" style={{ animationDelay: `${idx * 0.06}s` }}>
              <div className="post-header">
                <div
                  className="post-avatar"
                  style={{ background: `linear-gradient(135deg, ${post.avatarBg}, #080609)`, color: post.avatarColor, borderColor: post.avatarColor + "55" }}
                >
                  {post.initials}
                </div>
                <div className="post-meta">
                  <div>
                    <span className="post-author">{post.author}</span>
                    {post.pseudo && <span className="post-pseudo">@{post.pseudo}</span>}
                  </div>
                  <div className="post-meta-row">
                    <span className="post-time">{post.time}</span>
                    {post.community && (
                      <span className="post-community-tag">🏘️ {post.community}</span>
                    )}
                    <span className={`post-type-badge ${post.badge}`}>{post.badgeLabel}</span>
                    {post.discovery && <span className="discovery-tag">✦ Descoberta</span>}
                  </div>
                </div>
                <button className="post-more">⋯</button>
              </div>

              {/* BODY por tipo */}
              {post.type === "text" && (
                <div className="post-body-text">{post.content}</div>
              )}

              {post.type === "poem" && (
                <div className="post-body-poem">
                  <span className="poem-kanji">{post.kanji}</span>
                  <div className="poem-text">{post.content}</div>
                </div>
              )}

              {post.type === "excerpt" && (
                <div className="post-body-excerpt">
                  <span className="excerpt-label">Trecho de obra</span>
                  <div className="excerpt-text">"{post.excerpt}"</div>
                  <div className="excerpt-work">— {post.workTitle}</div>
                </div>
              )}

              {post.type === "chapter" && (
                <div className="post-body-chapter">
                  <span className="chapter-icon">📖</span>
                  <div className="chapter-info">
                    <div className="chapter-work">{post.workTitle}</div>
                    <div className="chapter-title">{post.chapterTitle}</div>
                    <div className="chapter-meta">{post.chapterMeta}</div>
                  </div>
                  <span className="chapter-arrow">→</span>
                </div>
              )}

              {post.type === "question" && (
                <div className="post-body-question">
                  <span className="question-label">Pergunta para a comunidade</span>
                  <div className="question-text">{post.question}</div>
                </div>
              )}

              {post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map(t => (
                    <span key={t} className="post-tag">#{t}</span>
                  ))}
                </div>
              )}

              <div className="post-actions">
                <button
                  className={`post-action ${post.liked ? "liked" : ""}`}
                  onClick={() => toggleLike(post.id)}
                >
                  <span className="action-icon">{post.liked ? "♥" : "♡"}</span>
                  {post.likes}
                </button>
                <button className="post-action">
                  <span className="action-icon">💬</span>
                  {post.comments}
                </button>
                <button
                  className={`post-action ${post.bookmarked ? "bookmarked" : ""}`}
                  onClick={() => toggleBookmark(post.id)}
                >
                  <span className="action-icon">{post.bookmarked ? "★" : "☆"}</span>
                  {post.bookmarks}
                </button>
                <div className="action-divider" />
                <button className="post-action">
                  <span className="action-icon">↪</span> Compartilhar
                </button>
              </div>
            </article>
          ))}
        </main>

        {/* ── SIDEBAR RIGHT ── */}
        <aside className="sidebar-right">

          {/* Escritor do Dia */}
          <div className="widget">
            <div className="widget-title">Escritor do Dia</div>
            <div className="wotd">
              <div className="wotd-avatar">Y</div>
              <div className="wotd-name">Yuki Hoshida</div>
              <div className="wotd-pseudo">✦ lua-errante</div>
              <div className="wotd-bio">"Escrevo porque o silêncio tem palavras demais para eu ignorar."</div>
            </div>
          </div>

          {/* Online agora */}
          <div className="widget">
            <div className="widget-title">Online Agora</div>
            <div className="online-list">
              {ONLINE.map((u, i) => (
                <div key={i} className="online-item">
                  <div
                    className="online-avatar"
                    style={{ background: `linear-gradient(135deg, ${u.bg}, #080609)`, color: u.color, borderColor: u.color + "55" }}
                  >
                    {u.initials}
                    <span className="online-pip" />
                  </div>
                  <div className="online-info">
                    <div className="online-name">{u.name}</div>
                    <div className="online-status">{u.status}</div>
                  </div>
                </div>
              ))}
            </div>
            <span className="see-more">ver todos →</span>
          </div>

          {/* Trending tags */}
          <div className="widget">
            <div className="widget-title">Em Alta Agora</div>
            <div className="tag-list">
              {TRENDING.map((t, i) => (
                <div key={i} className="trending-tag">
                  <span className="tag-name">{t.tag}</span>
                  <span className="tag-count">{t.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comunidades sugeridas */}
          <div className="widget">
            <div className="widget-title">Comunidades para Você</div>
            {COMMUNITIES.map((c, i) => (
              <div key={i} className="comm-item">
                <span className="comm-emoji">{c.emoji}</span>
                <div className="comm-info">
                  <div className="comm-name">{c.name}</div>
                  <div className="comm-count">{c.count}</div>
                </div>
                <button
                  className={`btn-join ${joined[i] ? "joined" : ""}`}
                  onClick={() => setJoined(j => ({ ...j, [i]: !j[i] }))}
                >
                  {joined[i] ? "✓ Membro" : "+ Entrar"}
                </button>
              </div>
            ))}
            <span className="see-more">explorar todas →</span>
          </div>

        </aside>
      </div>
    </>
  );
}