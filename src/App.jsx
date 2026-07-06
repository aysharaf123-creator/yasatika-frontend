import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════════
   BACKEND CONNECTION
══════════════════════════════════════════════════════════════ */
const API_BASE = import.meta?.env?.VITE_API_URL || "https://yasatika-backend-production.up.railway.app/api";

const api = {
  async get(path) {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error((await res.json().catch(()=>({}))).message || "Request failed");
    return res.json();
  },
  async post(path, body, token) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.json().catch(()=>({}))).message || "Request failed");
    return res.json();
  },
};


const IMGS = {
  hijabWine:    "/hijabWine.jpg",
  hijabPurple:  "/hijabPurple.jpg",
  hijabGreen:   "/hijabGreen.jpg",
  hijabEarthy:  "/hijabEarthy.jpg",
  hijabNeutral: "/hijabNeutral.jpg",
  hijabGrey:    "/hijabGrey.jpg",
  hijabWomen:   "/hijabWomen.jpg",
  jewHeart:     "/jewHeart.jpg",
  jewNecklace:  "/jewNecklace.jpg",
  jewCharm:     "/jewCharm.jpg",
  jewEarrings:  "/jewEarrings.jpg",
};

const GOLD = "#C9A96E";
const BLACK = "#1A1A1A";
const BEIGE = "#F5F0E8";
const WHITE = "#FFFFFF";
const MUTED = "#8A8278";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Inter',sans-serif;background:#fff;color:#1A1A1A;overflow-x:hidden}
  img{display:block;max-width:100%}

  /* NAV */
  .nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;
    justify-content:space-between;padding:18px 48px;background:rgba(255,255,255,0.97);
    box-shadow:0 1px 0 #EDE5D8;backdrop-filter:blur(8px)}
  .logo{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:400;
    letter-spacing:.12em;color:#1A1A1A;text-transform:uppercase;cursor:pointer}
  .logo span{color:#C9A96E}
  .nav-links{display:flex;gap:28px;list-style:none;align-items:center}
  .nav-links button{font-size:11px;letter-spacing:.15em;text-transform:uppercase;
    color:#3A3A3A;background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;
    transition:color .2s;padding:0}
  .nav-links button:hover{color:#C9A96E}
  .cart-btn{position:relative;background:none;border:none;cursor:pointer;
    font-size:20px;padding:4px}
  .cart-badge{position:absolute;top:-4px;right:-6px;background:#C9A96E;color:#fff;
    font-size:9px;font-weight:500;width:16px;height:16px;border-radius:50%;
    display:flex;align-items:center;justify-content:center}
  .burger{display:none;flex-direction:column;gap:5px;cursor:pointer;
    background:none;border:none;padding:4px}
  .burger span{display:block;width:22px;height:1px;background:#1A1A1A}

  /* HERO */
  .hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;margin-top:61px}
  .hero-l{background:#F5F0E8;display:flex;flex-direction:column;justify-content:center;
    padding:80px 56px}
  .hero-r{overflow:hidden;background:#F5F0E8;display:flex;align-items:center;justify-content:center}
  .hero-r img{width:100%;height:100%;object-fit:contain;object-position:center center}
  .hero-eye{font-size:10px;letter-spacing:.35em;text-transform:uppercase;
    color:#C9A96E;margin-bottom:20px}
  .hero-h{font-family:'Cormorant Garamond',serif;
    font-size:clamp(44px,5vw,80px);font-weight:300;line-height:.95;color:#1A1A1A}
  .hero-h em{font-style:italic;color:#C9A96E}
  .hero-p{font-size:13px;color:#8A8278;max-width:360px;line-height:1.8;
    margin-top:20px;font-weight:300}
  .hero-btns{display:flex;gap:12px;margin-top:36px;flex-wrap:wrap}
  .btn-dark{font-size:11px;letter-spacing:.18em;text-transform:uppercase;
    background:#1A1A1A;color:#fff;border:none;padding:14px 32px;
    cursor:pointer;transition:background .25s;font-family:'Inter',sans-serif}
  .btn-dark:hover{background:#3A3A3A}
  .btn-gold{font-size:11px;letter-spacing:.18em;text-transform:uppercase;
    background:transparent;color:#C9A96E;border:1px solid #C9A96E;padding:14px 32px;
    cursor:pointer;transition:all .25s;font-family:'Inter',sans-serif}
  .btn-gold:hover{background:#C9A96E;color:#fff}

  /* STRIP */
  .strip{background:#1A1A1A;padding:14px 48px;
    display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap}
  .strip span{font-size:10px;letter-spacing:.22em;text-transform:uppercase;
    color:rgba(255,255,255,.45);display:flex;align-items:center;gap:10px}
  .strip span::before{content:'◆';font-size:6px;color:#C9A96E}

  /* SECTIONS */
  .sec{padding:80px 48px}
  .inner{max-width:1200px;margin:0 auto}
  .sec-lbl{font-size:10px;letter-spacing:.3em;text-transform:uppercase;
    color:#C9A96E;margin-bottom:12px}
  .sec-h{font-family:'Cormorant Garamond',serif;
    font-size:clamp(32px,4vw,56px);font-weight:300;line-height:1.05;color:#1A1A1A}
  .sec-h em{font-style:italic}

  /* FILTER TABS */
  .filter-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:36px 0 28px}
  .tab{font-size:11px;letter-spacing:.15em;text-transform:uppercase;
    padding:9px 22px;border:1px solid #EDE5D8;background:#fff;
    cursor:pointer;transition:all .2s;font-family:'Inter',sans-serif;color:#8A8278}
  .tab.active{background:#1A1A1A;color:#fff;border-color:#1A1A1A}
  .tab:hover:not(.active){border-color:#C9A96E;color:#C9A96E}

  /* PRODUCT GRID */
  .prod-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
  .prod-card{background:#fff;border:1px solid #F0EBE3;cursor:pointer;
    transition:box-shadow .3s;position:relative;overflow:hidden}
  .prod-card:hover{box-shadow:0 8px 40px rgba(0,0,0,.1)}
  .prod-img{height:320px;overflow:hidden;position:relative;background:#F5F0E8}
  .prod-img img{width:100%;height:100%;object-fit:cover;
    transition:transform .6s cubic-bezier(.22,1,.36,1)}
  .prod-card:hover .prod-img img{transform:scale(1.05)}
  .prod-badge{position:absolute;top:12px;left:12px;background:#C9A96E;
    color:#fff;font-size:9px;letter-spacing:.15em;text-transform:uppercase;
    padding:4px 10px}
  .prod-info{padding:18px 20px}
  .prod-cat{font-size:9px;letter-spacing:.22em;text-transform:uppercase;
    color:#C9A96E;margin-bottom:6px}
  .prod-name{font-family:'Cormorant Garamond',serif;font-size:20px;
    font-weight:400;color:#1A1A1A;margin-bottom:4px}
  .prod-desc{font-size:12px;color:#8A8278;line-height:1.6;
    margin-bottom:12px;font-weight:300}
  .prod-footer{display:flex;align-items:center;justify-content:space-between}
  .prod-price{font-family:'Cormorant Garamond',serif;font-size:22px;
    font-weight:400;color:#1A1A1A}
  .prod-price span{font-size:13px;color:#8A8278;font-family:'Inter',sans-serif;font-weight:300}
  .add-btn{font-size:10px;letter-spacing:.15em;text-transform:uppercase;
    background:#1A1A1A;color:#fff;border:none;padding:9px 16px;
    cursor:pointer;transition:background .2s;font-family:'Inter',sans-serif}
  .add-btn:hover{background:#C9A96E}

  /* COLOUR SWATCHES */
  .colours{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap}
  .swatch{width:20px;height:20px;border-radius:50%;border:2px solid transparent;
    cursor:pointer;transition:border-color .2s}
  .swatch.sel{border-color:#1A1A1A}
  .swatch:hover{border-color:#C9A96E}
  .colour-name{font-size:11px;color:#8A8278;margin-bottom:8px;min-height:16px}

  /* CART SIDEBAR */
  .cart-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:300;
    opacity:0;visibility:hidden;transition:all .3s}
  .cart-overlay.open{opacity:1;visibility:visible}
  .cart-drawer{position:fixed;top:0;right:0;bottom:0;width:400px;
    background:#fff;z-index:301;transform:translateX(100%);
    transition:transform .35s cubic-bezier(.22,1,.36,1);
    display:flex;flex-direction:column}
  .cart-drawer.open{transform:translateX(0)}
  .cart-head{padding:24px 28px;border-bottom:1px solid #F0EBE3;
    display:flex;justify-content:space-between;align-items:center}
  .cart-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:300}
  .cart-close{background:none;border:none;font-size:22px;cursor:pointer;color:#8A8278}
  .cart-items{flex:1;overflow-y:auto;padding:20px 28px}
  .cart-empty{text-align:center;padding:60px 20px}
  .cart-empty-ico{font-size:48px;margin-bottom:16px;opacity:.3}
  .cart-empty p{font-size:13px;color:#8A8278;line-height:1.7}
  .cart-item{display:grid;grid-template-columns:80px 1fr auto;
    gap:14px;padding:16px 0;border-bottom:1px solid #F5F0E8;align-items:start}
  .ci-img{width:80px;height:80px;object-fit:cover;background:#F5F0E8}
  .ci-name{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:400}
  .ci-meta{font-size:11px;color:#8A8278;margin:3px 0}
  .ci-qty{display:flex;align-items:center;gap:10px;margin-top:8px}
  .qty-btn{width:24px;height:24px;border:1px solid #EDE5D8;background:#fff;
    cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;
    transition:all .2s}
  .qty-btn:hover{border-color:#C9A96E;color:#C9A96E}
  .qty-num{font-size:13px;min-width:20px;text-align:center}
  .ci-price{font-family:'Cormorant Garamond',serif;font-size:18px;white-space:nowrap}
  .ci-remove{background:none;border:none;color:#C4BAB4;cursor:pointer;
    font-size:16px;padding:2px;transition:color .2s}
  .ci-remove:hover{color:#1A1A1A}
  .cart-foot{padding:20px 28px;border-top:1px solid #F0EBE3}
  .cart-summary{margin-bottom:16px}
  .cart-row{display:flex;justify-content:space-between;
    font-size:13px;color:#8A8278;margin-bottom:8px}
  .cart-row.total{font-family:'Cormorant Garamond',serif;font-size:20px;
    color:#1A1A1A;font-weight:400;margin-top:12px;padding-top:12px;
    border-top:1px solid #EDE5D8}
  .checkout-btn{width:100%;font-size:11px;letter-spacing:.2em;text-transform:uppercase;
    background:#C9A96E;color:#fff;border:none;padding:16px;
    cursor:pointer;transition:background .25s;font-family:'Inter',sans-serif;margin-bottom:10px}
  .checkout-btn:hover{background:#B8956A}
  .wa-btn{width:100%;font-size:11px;letter-spacing:.15em;text-transform:uppercase;
    background:#25D366;color:#fff;border:none;padding:14px;
    cursor:pointer;font-family:'Inter',sans-serif;display:flex;
    align-items:center;justify-content:center;gap:8px}

  /* PRODUCT MODAL */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:400;
    display:flex;align-items:center;justify-content:center;padding:20px;
    opacity:0;visibility:hidden;transition:all .3s}
  .modal-overlay.open{opacity:1;visibility:visible}
  .modal{background:#fff;max-width:860px;width:100%;max-height:90vh;
    overflow-y:auto;display:grid;grid-template-columns:1fr 1fr}
  .modal-img{height:100%;min-height:400px;overflow:hidden}
  .modal-img img{width:100%;height:100%;object-fit:cover}
  .modal-body{padding:40px 36px;display:flex;flex-direction:column}
  .modal-cat{font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:#C9A96E;margin-bottom:10px}
  .modal-name{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:300;line-height:1.1;margin-bottom:8px}
  .modal-price{font-family:'Cormorant Garamond',serif;font-size:28px;color:#1A1A1A;margin-bottom:16px}
  .modal-desc{font-size:13px;color:#8A8278;line-height:1.8;font-weight:300;margin-bottom:20px}
  .modal-label{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#1A1A1A;margin-bottom:10px}
  .modal-close{position:absolute;top:16px;right:20px;background:none;border:none;
    font-size:24px;cursor:pointer;color:#8A8278;z-index:10}
  .modal-add{width:100%;font-size:11px;letter-spacing:.2em;text-transform:uppercase;
    background:#1A1A1A;color:#fff;border:none;padding:15px;
    cursor:pointer;margin-top:auto;font-family:'Inter',sans-serif;transition:background .25s}
  .modal-add:hover{background:#C9A96E}
  .modal-features{margin:16px 0}
  .modal-feat{display:flex;align-items:center;gap:10px;font-size:12px;
    color:#8A8278;margin-bottom:8px;font-weight:300}
  .modal-feat::before{content:'✓';color:#C9A96E;font-weight:500}

  /* CHECKOUT MODAL */
  .checkout-modal{background:#fff;max-width:560px;width:100%;
    max-height:90vh;overflow-y:auto;padding:40px;position:relative}
  .checkout-modal h2{font-family:'Cormorant Garamond',serif;font-size:30px;
    font-weight:300;margin-bottom:6px}
  .checkout-modal p{font-size:13px;color:#8A8278;margin-bottom:28px}
  .form-group{margin-bottom:18px}
  .form-group label{display:block;font-size:10px;letter-spacing:.2em;
    text-transform:uppercase;color:#8A8278;margin-bottom:6px}
  .form-group input,.form-group select,.form-group textarea{
    width:100%;border:1px solid #EDE5D8;padding:12px 14px;
    font-size:13px;font-family:'Inter',sans-serif;color:#1A1A1A;
    outline:none;transition:border-color .2s;background:#fff}
  .form-group input:focus,.form-group select:focus,.form-group textarea:focus{
    border-color:#C9A96E}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .pay-methods{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:16px 0}
  .pay-opt{border:1px solid #EDE5D8;padding:14px;cursor:pointer;
    text-align:center;transition:all .2s}
  .pay-opt.sel{border-color:#C9A96E;background:#FDF9F4}
  .pay-opt-ico{font-size:22px;margin-bottom:4px}
  .pay-opt-lbl{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#8A8278}
  .place-btn{width:100%;font-size:11px;letter-spacing:.2em;text-transform:uppercase;
    background:#C9A96E;color:#fff;border:none;padding:16px;
    cursor:pointer;font-family:'Inter',sans-serif;margin-top:10px;transition:background .25s}
  .place-btn:hover{background:#B8956A}

  /* SUCCESS */
  .success-modal{background:#fff;max-width:440px;width:100%;
    padding:48px 40px;text-align:center}
  .success-ico{font-size:56px;margin-bottom:20px}
  .success-modal h2{font-family:'Cormorant Garamond',serif;font-size:32px;
    font-weight:300;margin-bottom:12px}
  .success-modal p{font-size:13px;color:#8A8278;line-height:1.8;margin-bottom:24px}

  /* JEWELLERY GRID */
  .jew-grid{display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-top:48px}
  .jew-main{grid-row:span 2;position:relative;overflow:hidden;height:600px}
  .jew-main img{width:100%;height:100%;object-fit:cover;
    transition:transform .7s cubic-bezier(.22,1,.36,1)}
  .jew-main:hover img{transform:scale(1.04)}
  .jew-side{position:relative;overflow:hidden;height:298px}
  .jew-side img{width:100%;height:100%;object-fit:cover;
    transition:transform .7s cubic-bezier(.22,1,.36,1)}
  .jew-side:hover img{transform:scale(1.04)}
  .img-lbl{position:absolute;bottom:16px;left:16px;
    font-size:9px;letter-spacing:.22em;text-transform:uppercase;
    color:rgba(255,255,255,.92);background:rgba(0,0,0,.4);
    padding:5px 10px;backdrop-filter:blur(3px)}

  /* COLOUR LOOKBOOK */
  .look-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3px}
  .look-item{display:flex;flex-direction:column;background:#fff}
  .look-img-wrap{height:300px;position:relative;overflow:hidden;cursor:pointer}
  .look-img-wrap img{width:100%;height:100%;object-fit:cover;
    transition:transform .6s cubic-bezier(.22,1,.36,1)}
  .look-img-wrap:hover img{transform:scale(1.06)}
  .look-info{padding:14px 16px 16px}
  .look-swatches{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px}
  .look-btn{width:100%;background:#1A1A1A;color:#fff;border:none;padding:10px;
  font-size:11px;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;
  transition:background .2s;font-family:'Inter',sans-serif}
  .look-btn:hover{background:#C9A96E}
  /* COLOUR MATCHER */
  .matcher-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px}
  .matcher{background:#fff;width:min(720px,100%);max-height:88vh;overflow-y:auto;padding:36px 40px;position:relative}
  .matcher-tabs{display:flex;margin-bottom:24px;border-bottom:1px solid #EDE5D8}
  .matcher-tab{padding:10px 24px;font-size:11px;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;background:none;border:none;border-bottom:2px solid transparent;color:#8A8278;transition:all .2s;font-family:'Inter',sans-serif}
  .matcher-tab.active{border-bottom-color:#C9A96E;color:#1A1A1A}
  .dress-palette{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
  .dress-swatch{width:36px;height:36px;border-radius:50%;cursor:pointer;transition:transform .2s;flex-shrink:0}
  .dress-swatch:hover{transform:scale(1.18)}
  .match-results{margin-top:24px}
  .match-section{margin-bottom:22px}
  .match-section-lbl{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#8A8278;margin-bottom:10px}
  .match-swatches{display:flex;flex-wrap:wrap;gap:8px}
  .match-chip{display:flex;align-items:center;gap:8px;padding:6px 12px;border:1px solid #EDE5D8;cursor:pointer;transition:border-color .2s}
  .match-chip:hover{border-color:#C9A96E}
  .match-dot{width:22px;height:22px;border-radius:50%;flex-shrink:0}
  .match-name{font-size:12px;color:#1A1A1A}
  .upload-zone{border:2px dashed #EDE5D8;padding:40px;text-align:center;cursor:pointer;display:block;transition:border-color .2s;margin-bottom:4px}
  .upload-zone:hover{border-color:#C9A96E}
  .look-lbl{position:absolute;bottom:14px;left:14px;
    font-size:9px;letter-spacing:.2em;text-transform:uppercase;
    color:rgba(255,255,255,.9);background:rgba(0,0,0,.38);
    padding:5px 10px;backdrop-filter:blur(3px)}

  /* PHILOSOPHY */
  .phil{background:#1A1A1A;text-align:center;padding:100px 48px}
  .phil-ey{font-size:10px;letter-spacing:.35em;text-transform:uppercase;color:#C9A96E;margin-bottom:24px}
  .phil-h{font-family:'Cormorant Garamond',serif;
    font-size:clamp(32px,5.5vw,72px);font-weight:300;font-style:italic;
    color:#fff;max-width:780px;margin:0 auto;line-height:1.1}
  .phil-h strong{font-style:normal;color:#C9A96E;font-weight:300}
  .phil-p{font-size:14px;line-height:1.85;color:rgba(255,255,255,.45);
    max-width:480px;margin:24px auto 0;font-weight:300}

  /* ABOUT */
  .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:72px;
    align-items:center;margin-top:56px}
  .about-vis{position:relative;height:520px}
  .about-vis img{width:84%;height:88%;object-fit:contain;object-position:center;background:#1E2A4A;border-radius:8px}
  .about-accent{position:absolute;bottom:0;right:0;width:44%;height:50%;
    background:#E0C898;opacity:.3}
  .about-quote{position:absolute;bottom:32px;left:-16px;background:#fff;
    padding:24px 28px;box-shadow:0 4px 32px rgba(0,0,0,.09);width:248px}
  .about-qt{font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;
    font-weight:300;color:#1A1A1A;line-height:1.45}
  .about-qa{font-size:10px;letter-spacing:.18em;text-transform:uppercase;
    color:#C9A96E;margin-top:10px}
  .body-p{font-size:14px;line-height:1.85;color:#3A3A3A;font-weight:300;margin-top:18px}
  .stats{display:flex;flex-wrap:wrap;gap:16px;margin-top:40px}
  .stat-card{border:1px solid rgba(201,169,110,.25);padding:20px 22px;position:relative;overflow:hidden;background:#fff}
  .stat-card::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:#C9A96E}
  .s-num{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:300;color:#1A1A1A;line-height:1}
  .s-lbl{font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#C9A96E;margin-top:6px}

  /* CONTACT */
  .ct-bg{background:#F5F0E8;text-align:center}
  .ct-h{font-family:'Cormorant Garamond',serif;
    font-size:clamp(36px,5.5vw,72px);font-weight:300;color:#1A1A1A;line-height:1.05}
  .ct-h em{font-style:italic;color:#C9A96E}
  .ct-p{font-size:14px;color:#8A8278;margin:20px auto;max-width:420px;line-height:1.8;font-weight:300}
  .ct-cards{display:flex;justify-content:center;gap:18px;margin-top:40px;flex-wrap:wrap}
  .ct-card{display:flex;flex-direction:column;align-items:center;gap:7px;
    text-decoration:none;padding:24px 32px;background:#fff;
    border:1px solid #EDE5D8;transition:border-color .25s,box-shadow .25s;min-width:186px}
  .ct-card:hover{border-color:#C9A96E;box-shadow:0 4px 20px rgba(201,169,110,.14)}
  .ct-ico{font-size:20px}
  .ct-lbl{font-size:9px;letter-spacing:.25em;text-transform:uppercase;color:#8A8278}
  .ct-val{font-family:'Cormorant Garamond',serif;font-size:14px;color:#1A1A1A}

  /* POLICY BANNER */
  .policy-banner{background:#111;padding:56px 48px}
  .policy-banner-inner{max-width:1100px;margin:0 auto}
  .policy-banner-title{font-family:'Cormorant Garamond',serif;font-size:13px;letter-spacing:.35em;
    text-transform:uppercase;color:#C9A96E;text-align:center;margin-bottom:8px}
  .policy-banner-sub{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:300;
    color:#fff;text-align:center;margin-bottom:40px;letter-spacing:.03em}
  .policy-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.07)}
  .policy-card{background:#111;padding:36px 32px;display:flex;flex-direction:column;gap:14px}
  .policy-icon{width:40px;height:40px;border:1px solid rgba(201,169,110,.35);border-radius:50%;
    display:flex;align-items:center;justify-content:center;font-size:18px}
  .policy-card-h{font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:#C9A96E}
  .policy-card-body{font-size:13px;color:rgba(255,255,255,.45);line-height:1.75;font-weight:300}
  .policy-card-note{font-size:11px;color:rgba(255,255,255,.22);letter-spacing:.06em;margin-top:4px}
  @media(max-width:768px){
    .policy-cards{grid-template-columns:1fr}
    .policy-banner{padding:40px 20px}
  }

  /* FOOTER */
  footer{background:#1A1A1A;padding:52px 48px 26px}
  .ft{display:flex;justify-content:space-between;align-items:flex-start;
    padding-bottom:32px;border-bottom:1px solid rgba(255,255,255,.08);
    flex-wrap:wrap;gap:24px}
  .ft-logo{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:300;
    letter-spacing:.1em;color:#fff}
  .ft-logo span{color:#C9A96E}
  .ft-tag{font-size:11px;color:rgba(255,255,255,.28);letter-spacing:.12em;margin-top:6px}
  .ft-nav{display:flex;gap:52px;flex-wrap:wrap}
  .ft-nav h4{font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:#C9A96E;margin-bottom:16px}
  .ft-nav ul{list-style:none}
  .ft-nav li{margin-bottom:10px}
  .ft-nav a,.ft-nav button{font-size:13px;color:rgba(255,255,255,.4);text-decoration:none;
    background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;
    transition:color .2s;font-weight:300;padding:0}
  .ft-nav a:hover,.ft-nav button:hover{color:#C9A96E}
  .ft-bot{display:flex;justify-content:space-between;align-items:center;
    padding-top:22px;flex-wrap:wrap;gap:12px}
  .ft-copy{font-size:11px;color:rgba(255,255,255,.2)}
  .ft-soc{display:flex;gap:14px}
  .ft-soc a{width:32px;height:32px;border:1px solid rgba(255,255,255,.1);
    display:flex;align-items:center;justify-content:center;font-size:11px;
    color:rgba(255,255,255,.35);text-decoration:none;transition:all .2s}
  .ft-soc a:hover{border-color:#C9A96E;color:#C9A96E}

  /* TOAST */
  .toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(80px);
    background:#1A1A1A;color:#fff;padding:12px 24px;font-size:12px;
    letter-spacing:.1em;z-index:500;transition:transform .35s cubic-bezier(.22,1,.36,1);
    display:flex;align-items:center;gap:10px;white-space:nowrap}
  .toast.show{transform:translateX(-50%) translateY(0)}
  .toast-dot{width:8px;height:8px;border-radius:50%;background:#C9A96E;flex-shrink:0}

  /* MOBILE */
  .mmenu{position:fixed;inset:0;background:#fff;z-index:300;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px;
    transition:opacity .3s,visibility .3s}
  .mmenu.hide{opacity:0;visibility:hidden}
  .mmenu button{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:300;
    color:#1A1A1A;background:none;border:none;cursor:pointer}
  .mclose{position:absolute;top:22px;right:22px;background:none;border:none;
    font-size:22px;cursor:pointer;color:#1A1A1A;padding:8px}

  @media(max-width:900px){
    .nav{padding:14px 20px}
    .nav-links{display:none}
    .burger{display:flex}
    .hero{grid-template-columns:1fr;min-height:auto}
    .hero-l{padding:60px 24px 44px}
    .hero-r{height:360px}
    .sec{padding:56px 20px}
    .prod-grid{grid-template-columns:repeat(2,1fr);gap:14px}
    .prod-img{height:240px}
    .look-grid{grid-template-columns:repeat(2,1fr)}
    .look-item{height:220px}
    .jew-grid{grid-template-columns:1fr}
    .jew-main{grid-row:span 1;height:340px}
    .jew-side{height:240px}
    .about-grid{grid-template-columns:1fr;gap:36px}
    .about-vis{height:340px}
    .cart-drawer{width:100%}
    .modal{grid-template-columns:1fr}
    .modal-img{height:280px;min-height:0}
    .modal-body{padding:24px}
    .strip{padding:14px 20px;gap:16px}
    .ft{flex-direction:column}
    .ct-cards{gap:12px}
    .checkout-modal{padding:28px 20px}
    .form-row{grid-template-columns:1fr}
  }
  @media(max-width:540px){
    .prod-grid{grid-template-columns:1fr}
    .hero-btns{flex-direction:column}
    .btn-dark,.btn-gold{text-align:center}
    .pay-methods{grid-template-columns:1fr}
    .look-grid{grid-template-columns:1fr 1fr}
    .ft-bot{flex-direction:column;align-items:flex-start}
  }
`;

// Shared colour charts — mirrors DataSeeder.java
const NEUTRALS_AND_NUDES = [
  "Black",
  "Light Skin", "Skin", "Saddle Brown", "Teddy Brown",
  "Almond", "Cacao", "Coffee Brown", "Chocolate",
];
const CHART_A_BRIGHTS_AND_TONALS = [
  "Corn Yellow", "Sage Green", "Light Lavender", "Dark Maroon", "Brick Red",
  "Powder Blue", "Nude Grey", "Denim Nude", "Silver Grey", "Nude Brown",
  "Nude #03", "Beige", "Nude #02", "Nude Pink", "Melon Pink", "Misty Pink",
  "Almond Brown", "Eggplant #01", "Navy Blue", "Brown", "Olive Green #01", "Bottle Green",
];
const CHART_B_DEEP_AND_PASTEL = [
  "Pickle Green", "Army Green", "Emerald", "Espresso #01", "Beige #01",
  "Peacock Blue", "Denim Dark", "Sky Blue", "Milk White", "Silver",
  "Maroon", "Mustard #01", "Apricot", "Peach #01",
  "Deep Purple", "Lavender", "Flamingo", "Soft Pink", "Blossom Peach",
];
const CHART_C_EARTH_AND_SEA_TONES = [
  "Dusty Grape", "Mulberry", "Pastel Pink", "Off White", "Lemon", "Nude Peach",
  "Teal Blue", "Denim Light", "Sandal Cream", "Pearl Cream", "Sea Green",
  "Maroon #01", "Bronze", "Fossil Grey", "Olive #01", "Burnt Brick",
  "Coral Pink", "Burnt Olive", "Eggshell", "Nude", "Dusty Mauve",
];
// MOJA-exclusive charts
const MOJA_BRICK_ORANGE = ["Fire Brick", "Brick Pink", "Brick Orange", "Deep Carrot", "Orange", "Pumpkin"];
const MOJA_CHART_B = [
  "Mushroom", "Light Ivory", "Avocado", "Pastel Blue", "Baby Pink",
  "Lavender Mist", "Pastel Brown", "Misty Pink 01",
  "Blue Grey",
  "Nude Sage", "Olive", "Castleton Green", "Dark Grey",
  "Ultra Wine", "Dark Eggplant",
];
const MOJA_CHART_F = [
  "Oats", "Ivory", "Chikku", "Salmon Pink", "Powder Pink", "Cupcake Pink", "Pastel Lav",
  "Nude Silver", "Nude Green", "Light Moss", "Dark Teal", "Dusty Lavender",
  "Blueberry", "Nude Mauve", "Plum", "Barbie Pink",
  "Watermelon", "Deep Brick", "Carrot", "Mustard", "Burnt Orange",
  "Forest", "Charcoal", "Khaki", "Slate",
  "Burgundy", "Wine", "Magenta", "Purple Berry",
  "Peacock Green", "Yale Blue", "Moss", "Lava",
  "Red", "Cherry Red", "Garnet", "Crimson",
  "Brick", "Strawberry", "Rhubarb", "Coral",
  "Tellina", "Plie",
  "Gold", "Grey", "Light Grey", "White", "Cream", "Camel",
  "Navy", "Royal Blue", "Baby Blue",
  "Sage", "Rose", "Blush", "Dusty Rose",
  "Purple", "Yellow", "Tan", "Rust", "Mint",
];

// Backend sends colour names as plain strings (no hex). This maps name -> hex for swatches.
const COLOUR_HEX = {
  // ── Neutrals & Nudes ──────────────────────────────────────────────────────
  "Light Skin":"#E8C9A8", "Skin":"#DDB18C", "Saddle Brown":"#8B4A2B", "Teddy Brown":"#9C6B45",
  "Almond":"#C9A077", "Cacao":"#5C3A28", "Coffee Brown":"#4A3022", "Chocolate":"#3D2817",
  // ── Chart A — Brights & Tonals ───────────────────────────────────────────
  "Corn Yellow":"#E8C547", "Sage Green":"#9CAF88", "Light Lavender":"#C9B6DB", "Dark Maroon":"#5C1A1A",
  "Brick Red":"#9B3A2C", "Powder Blue":"#A8C5D6", "Nude Grey":"#B5A89C", "Denim Nude":"#A89684",
  "Silver Grey":"#B8B8B8", "Nude Brown":"#A07A5C",
  "Nude #03":"#D4AA8A",           // warm mid-nude (distinct from Nude #D9B79A)
  "Beige":"#E0D2B8",
  "Nude #02":"#CFA888", "Nude Pink":"#E0B8AE", "Melon Pink":"#E8A19A", "Misty Pink":"#E5C5C0",
  "Almond Brown":"#8A6248", "Eggplant #01":"#4B0082", "Navy Blue":"#0D2240", "Brown":"#5C3D2E",
  "Olive Green #01":"#6B7C45",    // muted sage-olive
  "Bottle Green":"#1B4332",
  // ── Chart B — Deep & Pastel ──────────────────────────────────────────────
  "Pickle Green":"#5A6B3C", "Army Green":"#4B5320", "Emerald":"#1E8C5A", "Espresso #01":"#3C2A21",
  "Beige #01":"#D8C5A6", "Peacock Blue":"#1A5276", "Denim Dark":"#2C3E5C", "Sky Blue":"#87CEEB",
  "Milk White":"#F2EFE8", "Silver":"#C0C0C0", "Maroon":"#800020",
  "Mustard #01":"#C9A227",        // golden mustard
  "Apricot":"#E8A968", "Peach #01":"#F4B79A", "Deep Purple":"#3B1E5C", "Lavender":"#B497C7",
  "Flamingo":"#F4A7B9", "Soft Pink":"#F0C8CB", "Blossom Peach":"#F2B8A0",
  // ── Chart C — Earth & Sea Tones ─────────────────────────────────────────
  "Dusty Grape":"#6E4B5E", "Mulberry":"#7B2D43", "Pastel Pink":"#F0D5D8", "Off White":"#F5F0E8",
  "Lemon":"#E8D44D", "Nude Peach":"#EBBBA0", "Teal Blue":"#1B6B6B", "Denim Light":"#7B97AE",
  "Sandal Cream":"#E6D3B3", "Pearl Cream":"#F2E8D5", "Sea Green":"#2E8B6F", "Bronze":"#8C6239",
  "Fossil Grey":"#8C8378",
  "Maroon #01":"#8B0000",         // deep crimson-maroon (distinct from Maroon #800020)
  "Olive #01":"#7A8B2A",          // brighter yellow-olive (distinct from Olive Green #01 #6B7C45)
  "Burnt Brick":"#8A3B22", "Coral Pink":"#E87070",
  "Burnt Olive":"#5C5A2E", "Eggshell":"#F0EAD6",
  "Nude":"#D9B79A",               // classic nude
  "Dusty Mauve":"#9C7A82",
  "Olive":"#808000",              // classic pure olive
  // ── MOJA — Brick & Orange ────────────────────────────────────────────────
  "Fire Brick":"#8B1A1A","Red":"#CC2200","Cherry Red":"#BE1622","Garnet":"#7A1F2E","Crimson":"#5A0F1E","Brick":"#9E3D34","Strawberry":"#E03A52","Rhubarb":"#E05A6A","Coral":"#E8826E","Salmon":"#E89683","Tellina":"#EDA8AC","Plie":"#F2CDD0","Grey":"#808080","Light Grey":"#C0C0C0","White":"#F8F8F8","Cream":"#FFF8E7","Camel":"#C19A6B","Navy":"#0D2240","Royal Blue":"#2A52BE","Baby Blue":"#BFD6E0","Sage":"#9CAF88","Rose":"#E8B4B8","Blush":"#F0C8CB","Dusty Rose":"#D4868C","Purple":"#6B2D8B","Yellow":"#E8D44D","Tan":"#D2B48C","Rust":"#B7410E","Mint":"#93C572", "Brick Pink":"#B5474A", "Brick Orange":"#B6502E","Burnt Orange":"#CC5500",
  "Deep Carrot":"#A0531F", "Orange":"#D9601E", "Pumpkin":"#D9551A",
  // ── MOJA — Chart B ───────────────────────────────────────────────────────
  "Mushroom":"#C9B8A8", "Light Ivory":"#EFE2C8", "Avocado":"#A9C18A", "Pastel Blue":"#BFD6E0",
  "Baby Pink":"#F0C2CC", "Lavender Mist":"#B6A0B5", "Pastel Brown":"#A8917E", "Misty Pink 01":"#D97A85",
  "Blue Grey":"#7C8EA3", "Nude Sage":"#A6A074", "Castleton Green":"#0E4D3C", "Dark Grey":"#5B5F61",
  "Ultra Wine":"#5E1A2C", "Dark Eggplant":"#3A1A39",
  // ── MOJA — Chart F ───────────────────────────────────────────────────────
  "Oats":"#D8C7A8", "Ivory":"#EFE5CE", "Chikku":"#A87B5E", "Salmon Pink":"#E89683",
  "Powder Pink":"#E8B9C2", "Cupcake Pink":"#E6A6C0", "Pastel Lav":"#B49ACB",
  "Nude Silver":"#B6BFD4", "Nude Green":"#7F9A78", "Light Moss":"#88A368",
  "Dark Teal":"#1F5C57", "Dusty Lavender":"#7A5E84",
  "Blueberry":"#1E2E5C",
  "Nude Mauve":"#B59298",         // lighter nude-pink (distinct from Dusty Mauve #9C7A82)
  "Plum":"#5C2A4A",
  "Barbie Pink":"#D6336C", "Watermelon":"#D14B5A", "Deep Brick":"#8A2E1F",
  "Carrot":"#D9722C",
  "Mustard":"#D4A820",            // pure bright mustard (distinct from Mustard #01 #C9A227)
  // ── Brand basics ─────────────────────────────────────────────────────────
  "Black":"#1A1A1A", "Charcoal":"#36454F", "Slate":"#708090", "Khaki":"#C3B091",
  "Pistachio":"#93C572", "Forest":"#2D5A3D",
  // ── Lookbook extras ──────────────────────────────────────────────────────
  "Burgundy":"#722F37", "Wine":"#9B2335", "Magenta":"#E0218A",
  "Purple Berry":"#7B3B9E", "Peacock Green":"#00827F", "Yale Blue":"#0F4D92",
  "Moss":"#8A9A5B", "Lava":"#545454",
  "Gold": "#C9A96E", "Default": "#C9A96E",
};

const toSwatches = names => names.map(name => ({ name, hex: COLOUR_HEX[name] || "#C9A96E" }));

const ALL_COLOURS = toSwatches([
  ...NEUTRALS_AND_NUDES, ...CHART_A_BRIGHTS_AND_TONALS,
  ...CHART_B_DEEP_AND_PASTEL, ...CHART_C_EARTH_AND_SEA_TONES,
]);

const MOJA_COLOURS = toSwatches([
  ...NEUTRALS_AND_NUDES, ...CHART_A_BRIGHTS_AND_TONALS,
  ...CHART_B_DEEP_AND_PASTEL, ...CHART_C_EARTH_AND_SEA_TONES,
  ...MOJA_BRICK_ORANGE, ...MOJA_CHART_B, ...MOJA_CHART_F,
]);

// Colour families shown in the lookbook tiles
const LOOK_COLOURS = {
  hijabWine:    ["Ultra Wine","Burgundy","Dark Maroon","Wine","Magenta","Maroon","Maroon #01","Watermelon"],
  hijabPurple:  ["Dark Eggplant","Eggplant #01","Dusty Lavender","Purple Berry","Mulberry","Flamingo","Deep Purple","Lavender","Plum"],
  hijabGreen:   ["Black","Olive","Forest","Peacock Green","Yale Blue","Bottle Green","Navy Blue","Castleton Green"],
  hijabEarthy:  ["Forest","Moss","Olive","Khaki","Army Green","Burnt Olive","Nude Sage","Olive Green #01"],
  hijabNeutral: ["Off White","Milk White","Beige","Nude","Nude Peach","Oats","Ivory","Sandal Cream","Pearl Cream","Beige #01","Eggshell"],
  hijabGrey:    ["Black","Charcoal","Lava","Silver Grey","Fossil Grey","Dark Grey","Silver","Slate","Nude Grey"],
};

const DRESS_PALETTE = [
  {name:"Black",hex:"#1A1A1A"},{name:"Charcoal",hex:"#36454F"},{name:"Dark Grey",hex:"#545454"},
  {name:"Grey",hex:"#808080"},{name:"Light Grey",hex:"#C0C0C0"},
  {name:"White",hex:"#F5F5F5"},{name:"Cream",hex:"#FFFDD0"},{name:"Beige",hex:"#E8D8B8"},{name:"Camel",hex:"#C19A6B"},
  {name:"Navy",hex:"#0D2240"},{name:"Royal Blue",hex:"#1A3A8F"},{name:"Sky Blue",hex:"#87CEEB"},{name:"Baby Blue",hex:"#BFD6E0"},
  {name:"Emerald",hex:"#1E8C5A"},{name:"Forest",hex:"#2D5A3D"},{name:"Olive",hex:"#808000"},{name:"Sage",hex:"#9CAF88"},
  {name:"Burgundy",hex:"#722F37"},{name:"Wine",hex:"#9B2335"},{name:"Red",hex:"#C0392B"},{name:"Coral",hex:"#E8917A"},
  {name:"Magenta",hex:"#E0218A"},{name:"Rose",hex:"#E8B9C2"},{name:"Blush",hex:"#F0C8CB"},{name:"Dusty Rose",hex:"#D97A85"},
  {name:"Purple",hex:"#6B2D8B"},{name:"Lavender",hex:"#B497C7"},{name:"Plum",hex:"#5C2A4A"},
  {name:"Yellow",hex:"#E8D44D"},{name:"Mustard",hex:"#C9A227"},{name:"Orange",hex:"#D9601E"},
  {name:"Brown",hex:"#5C3D2E"},{name:"Tan",hex:"#D2B48C"},{name:"Chocolate",hex:"#3D2817"},
  {name:"Plie",hex:"#F2CDD0"},{name:"Tellina",hex:"#EDA8AC"},{name:"Rhubarb",hex:"#E05A6A"},{name:"Strawberry",hex:"#E03A52"},{name:"Cherry Red",hex:"#BE1622"},{name:"Red",hex:"#C82020"},{name:"Crimson",hex:"#5A0F1E"},{name:"Garnet",hex:"#7A1F2E"},{name:"Rust",hex:"#B7410E"},{name:"Burnt Orange",hex:"#CC5500"},{name:"Gold",hex:"#C9A96E"},{name:"Mint",hex:"#93C572"},
];

// Used only if the backend is unreachable (offline fallback / first paint before fetch resolves)
// Mirrors DataSeeder.java exactly — same products, prices, descriptions, badges, colours.
const FALLBACK_PRODUCTS = [
  {
    id:1, cat:"hijab", name:"Georgette Hijab - Normal",
    price:180, badge:"Bestseller",
    desc:"Everyday georgette hijab with a soft, breathable drape. Available across our full colour range.",
    img: "hijabWomen",
    inStock: true, unavailableColours: [],
    colours: MOJA_COLOURS,
    features:["100% Georgette","Lightweight & breathable","Full colour range","Everyday wear"],
  },
  {
    id:2, cat:"hijab", name:"MOJA Premium Hijab",
    price:260, badge:"New",
    desc:"MOJA heavy georgette and heavy chiffon, imported premium fabric with richer weight and finish.",
    img:"hijabWine",
    colours: MOJA_COLOURS,
    features:["Heavy Georgette & Heavy Chiffon","Premium imported fabric","Richer drape & finish","Full colour range"],
  },
  {
    id:3, cat:"hijab", name:"Zera Premium Hijab",
    price:260, badge:"Premium",
    desc:"Zera premium georgette and heavy chiffon, a luxury drape made for special wear.",
    img:"hijabPurple",
    colours: MOJA_COLOURS,
    features:["Premium Georgette & Heavy Chiffon","Luxury drape","Occasion wear","Full colour range"],
  },
  
  {
    id:7, cat:"jewellery", name:"Gold Heart Necklace",
    price:899, badge:"Bestseller",
    desc:"Delicate puffed heart pendant on a fine snake chain. Anti-tarnish 18K gold finish.",
    img:"jewHeart",
    colours:[{name:"Gold",hex:"#C9A96E"}],
    features:["Anti-tarnish guaranteed","18K gold finish","Waterproof","Hypoallergenic"],
  },
  {
    id:8, cat:"jewellery", name:"Layered Pendant Set",
    price:1299, badge:"New",
    desc:"Set of 5 delicate pendants — heart, star, bow, medallion & charm. Mix and layer.",
    img:"jewNecklace",
    colours:[{name:"Gold",hex:"#C9A96E"}],
    features:["Set of 5 pendants","Anti-tarnish","Adjustable chains","Gift box included"],
  },
  {
    id:9, cat:"jewellery", name:"Seashell Charm Necklace",
    price:799, badge:null,
    desc:"Whimsical seashell, pearl & starfish charm on a gold snake chain. Summer luxury.",
    img:"jewCharm",
    colours:[{name:"Gold",hex:"#C9A96E"},{name:"Silver",hex:"#C0C0C0"}],
    features:["Anti-tarnish","Handcrafted charm","Pearl accent","Waterproof"],
  },
  {
    id:10, cat:"jewellery", name:"Gold Earrings Collection",
    price:699, badge:"New",
    desc:"Choose from our curated range — florals, bows, spirals, hoops & more. All anti-tarnish.",
    img:"jewEarrings",
    colours:[{name:"Gold",hex:"#C9A96E"}],
    features:["Anti-tarnish gold","Wide variety","Lightweight","No allergic reaction"],
  },
];

function Toast({ msg, show }) {
  return (
    <div className={`toast ${show ? "show" : ""}`}>
      <div className="toast-dot" />
      {msg}
    </div>
  );
}

function ProductCard({ p, onAdd, onView }) {
  const [selColour, setSelColour] = useState(p.colours[0]);
  const [expanded, setExpanded] = useState(false);
  const unavail = new Set(p.unavailableColours || []);
  const isColourUnavail = c => unavail.has(c.name);
  const soldOut = p.inStock === false;
  return (
    <div className="prod-card" style={{opacity: soldOut ? 0.82 : 1}}>
      <div className="prod-img" onClick={() => !soldOut && setExpanded(e => !e)} style={{cursor: soldOut ? "default" : "pointer", position:"relative"}}>
        {soldOut
          ? <div className="prod-badge" style={{background:"#8A8278"}}>Sold Out</div>
          : p.badge && <div className="prod-badge">{p.badge}</div>
        }
        <img src={IMGS[p.img]} alt={p.name} />
        {soldOut && (
          <div style={{position:"absolute",inset:0,background:"rgba(255,255,255,0.45)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,letterSpacing:".18em",color:"#8A8278",background:"rgba(255,255,255,0.9)",padding:"8px 20px"}}>SOLD OUT</span>
          </div>
        )}
      </div>
      <div className="prod-info">
        <div className="prod-cat">{p.cat === "hijab" ? "Premium Hijab" : "Anti-Tarnish Jewellery"}</div>
        <div className="prod-name" onClick={() => onView(p)} style={{cursor:"pointer"}}>{p.name}</div>
        <div className="prod-desc">{p.desc}</div>
        {!soldOut && expanded && p.colours.length > 1 && (
          <div style={{marginTop:8,animation:"fadeIn .2s ease"}}>
            <div className="colours">
              {p.colours.map(c => {
                const unavailable = isColourUnavail(c);
                return (
                  <div key={c.name}
                    className={`swatch ${selColour.name===c.name&&!unavailable?"sel":""}`}
                    style={{
                      background: unavailable ? "#E0D8D0" : c.hex,
                      cursor: unavailable ? "not-allowed" : "pointer",
                      position:"relative",
                      opacity: unavailable ? 0.5 : 1,
                    }}
                    title={unavailable ? `${c.name} — Out of Stock` : c.name}
                    onClick={() => !unavailable && setSelColour(c)}>
                    {unavailable && (
                      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <div style={{width:"130%",height:1.5,background:"#8A8278",transform:"rotate(-45deg)",transformOrigin:"center"}}/>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="colour-name">
              {isColourUnavail(selColour)
                ? <span style={{color:"#8A8278"}}>{selColour.name} — Out of Stock</span>
                : selColour.name}
            </div>
          </div>
        )}
        {!soldOut && !expanded && p.colours.length > 1 && (
          <div style={{fontSize:11,color:'#C9A96E',letterSpacing:'.08em',marginTop:8,cursor:"pointer"}}
            onClick={() => setExpanded(true)}>
            TAP IMAGE TO SELECT COLOUR
          </div>
        )}
        <div className="prod-footer">
          {p.cat !== "jewellery"
            ? <div className="prod-price">₹{p.price.toLocaleString()} <span>/piece</span></div>
            : <div className="prod-price" style={{fontSize:13,letterSpacing:'.08em',color:'#8A8278'}}>Contact for price</div>
          }
          <button className="add-btn"
            onClick={() => !soldOut && !isColourUnavail(selColour) && onAdd(p, selColour)}
            disabled={soldOut || isColourUnavail(selColour)}
            style={{opacity: soldOut||isColourUnavail(selColour) ? 0.4 : 1, cursor: soldOut||isColourUnavail(selColour) ? "not-allowed" : "pointer"}}>
            {soldOut ? "Sold Out" : isColourUnavail(selColour) ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, open, onClose, onQty, onRemove, onCheckout }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 79; // shown as estimate; Kerala = free (calculated at checkout)
  const waMsg = encodeURIComponent(
    "Hi YasatikaStyles! I'd like to order:\n\n" +
    cart.map(i => `• ${i.name} (${i.colour}) x${i.qty} — ₹${i.price*i.qty}`).join("\n") +
    `\n\nTotal: ₹${(total+shipping).toLocaleString()}\n\nPlease confirm my order.`
  );
  return (
    <>
      <div className={`cart-overlay ${open?"open":""}`} onClick={onClose} />
      <div className={`cart-drawer ${open?"open":""}`}>
        <div className="cart-head">
          <div className="cart-title">Your Cart <span style={{fontSize:14,color:MUTED,fontFamily:"Inter"}}>({cart.length})</span></div>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-ico">🛍</div>
              <p>Your cart is empty.<br/>Explore our collections and add something beautiful.</p>
            </div>
          ) : cart.map(item => (
            <div key={item.cartId} className="cart-item">
              <img className="ci-img" src={IMGS[item.img]} alt={item.name} />
              <div>
                <div className="ci-name">{item.name}</div>
                <div className="ci-meta" style={{color:GOLD}}>{item.colour}</div>
                <div className="ci-qty">
                  <button className="qty-btn" onClick={() => onQty(item.cartId, -1)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => onQty(item.cartId, 1)}>+</button>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                <button className="ci-remove" onClick={() => onRemove(item.cartId)}>✕</button>
                <div className="ci-price">₹{(item.price*item.qty).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="cart-foot">
            <div className="cart-summary">
              <div className="cart-row"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
              <div className="cart-row"><span>Shipping</span><span style={{color:GOLD,fontSize:11}}>Free within Kerala · ₹79 elsewhere</span></div>
              <div className="cart-row total"><span>Total</span><span>₹{total.toLocaleString()}+</span></div>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>Proceed to Checkout</button>
            <a className="wa-btn" href={`https://wa.me/919495330729?text=${waMsg}`} target="_blank" rel="noopener noreferrer">
              📱 Order via WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}

function ProductModal({ product, open, onClose, onAdd, initialColour }) {
  const [selColour, setSelColour] = useState(null);
  useEffect(() => { setSelColour(null); }, [product]);
  if (!product) return null;
  const colour = selColour || initialColour || product.colours[0];
  return (
    <div className={`modal-overlay ${open?"open":""}`} onClick={e => e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{position:"relative"}}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-img">
          <img src={IMGS[product.img]} alt={product.name} />
        </div>
        <div className="modal-body">
          <div className="modal-cat">{product.cat==="hijab"?"Premium Hijab":"Anti-Tarnish Jewellery"}</div>
          <div className="modal-name">{product.name}</div>
          {product.cat !== "jewellery"
            ? <div className="modal-price">₹{product.price.toLocaleString()}</div>
            : <div className="modal-price" style={{fontSize:15,color:'#8A8278',letterSpacing:'.05em'}}>Contact for price</div>
          }
          <div className="modal-desc">{product.desc}</div>
          {product.colours.length > 1 && (
            <>
              <div className="modal-label">Select Colour — <span style={{color:GOLD,textTransform:"none",letterSpacing:0}}>{colour.name}</span></div>
              <div className="colours" style={{marginBottom:16}}>
                {product.colours.map(c => (
                  <div key={c.name} className={`swatch ${colour.name===c.name?"sel":""}`}
                    style={{background:c.hex,width:26,height:26}}
                    title={c.name}
                    onClick={() => setSelColour(c)} />
                ))}
              </div>
            </>
          )}
          <div className="modal-features">
            {product.features.map(f => <div key={f} className="modal-feat">{f}</div>)}
          </div>
          <button className="modal-add" onClick={() => { onAdd(product, colour); onClose(); }}>
            Add to Cart — ₹{product.price.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckoutModal({ open, cart, onClose, onSuccess }) {
  const [form, setForm] = useState({name:"",email:"",phone:"",address:"",city:"",state:"Kerala",pincode:""});
  const [placing, setPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const shipping = form.state === "Kerala" ? 0 : 79;
  const set = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const colourEmoji = (name="") => {
    const n = name.toLowerCase();
    if(n.includes("black")||n.includes("charcoal")) return "⚫";
    if(n.includes("white")||n.includes("ivory")||n.includes("cream")||n.includes("oats")) return "⚪";
    if(n.includes("red")||n.includes("cherry")||n.includes("crimson")||n.includes("garnet")||n.includes("maroon")||n.includes("brick")||n.includes("lava")||n.includes("rhubarb")||n.includes("strawberry")) return "🔴";
    if(n.includes("pink")||n.includes("blush")||n.includes("rose")||n.includes("flamingo")||n.includes("plie")||n.includes("tellina")||n.includes("barbie")||n.includes("cupcake")||n.includes("powder")) return "🩷";
    if(n.includes("coral")||n.includes("salmon")||n.includes("peach")||n.includes("apricot")) return "🟠";
    if(n.includes("orange")||n.includes("carrot")||n.includes("pumpkin")||n.includes("burnt")) return "🟠";
    if(n.includes("yellow")||n.includes("mustard")||n.includes("lemon")||n.includes("corn")) return "🟡";
    if(n.includes("gold")) return "🟡";
    if(n.includes("green")||n.includes("forest")||n.includes("emerald")||n.includes("sage")||n.includes("moss")||n.includes("olive")||n.includes("mint")||n.includes("teal")||n.includes("khaki")||n.includes("pickle")) return "🟢";
    if(n.includes("blue")||n.includes("navy")||n.includes("denim")||n.includes("sky")||n.includes("yale")||n.includes("peacock")) return "🔵";
    if(n.includes("purple")||n.includes("plum")||n.includes("eggplant")||n.includes("lavender")||n.includes("blueberry")||n.includes("berry")||n.includes("mulberry")) return "🟣";
    if(n.includes("burgundy")||n.includes("wine")||n.includes("magenta")||n.includes("watermelon")) return "🟣";
    if(n.includes("brown")||n.includes("chocolate")||n.includes("coffee")||n.includes("camel")||n.includes("tan")||n.includes("teddy")||n.includes("chikku")) return "🟤";
    if(n.includes("grey")||n.includes("gray")||n.includes("silver")||n.includes("slate")||n.includes("ash")) return "🩶";
    if(n.includes("nude")||n.includes("skin")||n.includes("beige")||n.includes("almond")) return "🫶";
    return "🎨";
  };

  const buildWaMessage = (orderId) => {
    const lines = cart.map(i => `• ${i.name} (${colourEmoji(i.colour)} ${i.colour}) x${i.qty} — ₹${i.price*i.qty}`).join("\n");
    return encodeURIComponent(
      "Hi YasatikaStyles! I'd like to place an order:\n\n" +
      lines +
      `\n\nSubtotal: ₹${total.toLocaleString()}\nShipping: ${shipping===0?"FREE":"₹"+shipping}\nTotal: ₹${(total+shipping).toLocaleString()}\n\n` +
      `Name: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}${form.city?", "+form.city:""}${form.state?", "+form.state:""}${form.pincode?" - "+form.pincode:""}\n` +
      (orderId ? `\nOrder ID: #${orderId}` : "") +
      "\n\nPlease confirm my order."
    );
  };

  const submit = async () => {
    if(!form.name||!form.phone||!form.address){alert("Please fill all required fields.");return;}
    setErrorMsg("");
    setPlacing(true);

    let orderId = null;
    try {
      const orderPayload = {
        customerName: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        paymentMethod: "WHATSAPP",
        items: cart.map(i => ({
          productId: i.id,
          selectedColour: i.colour,
          quantity: i.qty,
        })),
      };
      // 8-second timeout — if Railway is cold-starting, don't block the customer
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 8000));
      const order = await Promise.race([api.post("/orders/guest", orderPayload), timeout]);
      orderId = order.id;
    } catch (err) {
      console.warn("Could not save order to backend:", err.message);
      // Always proceed to WhatsApp even if backend fails or times out
    }

    setPlacing(false);
    const waUrl = `https://wa.me/919495330729?text=${buildWaMessage(orderId)}`;
    onSuccess({ name: form.name, orderId, waUrl, paid: false });
  };

  return (
    <div className={`modal-overlay ${open?"open":""}`} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="checkout-modal" style={{position:"relative"}}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Checkout</h2>
        <p>Fill in your details — we'll open WhatsApp with your order ready to send</p>
        {errorMsg && (
          <div style={{background:"#FDEDEC",border:"1px solid #F5C6C1",color:"#A33",
            padding:"12px 14px",fontSize:12,marginBottom:16,lineHeight:1.6}}>
            {errorMsg}
          </div>
        )}
        <div className="form-group">
          <label>Full Name *</label>
          <input value={form.name} onChange={set("name")} placeholder="Your full name" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Phone *</label>
            <input value={form.phone} onChange={set("phone")} placeholder="+91 XXXXX XXXXX" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={form.email} onChange={set("email")} placeholder="your@email.com" />
          </div>
        </div>
        <div className="form-group">
          <label>Delivery Address *</label>
          <textarea value={form.address} onChange={set("address")} rows={2} placeholder="House no, Street, Area" style={{resize:"none"}} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input value={form.city} onChange={set("city")} placeholder="City" />
          </div>
          <div className="form-group">
            <label>Pincode</label>
            <select value={form.state} onChange={set("state")} style={{width:"100%",padding:"10px 12px",border:"1px solid #EDE5D8",fontFamily:"'Inter',sans-serif",fontSize:13,color:"#1A1A1A",background:"#fff",marginBottom:8}}>
              {["Kerala","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh","Other"].map(s=>(
                <option key={s} value={s}>{s}{s==="Kerala"?" (Free Shipping)":""}</option>
              ))}
            </select>
            <input value={form.pincode} onChange={set("pincode")} placeholder="Pincode" />
          </div>
        </div>
        <div style={{background:"#F5F0E8",padding:"14px 16px",marginTop:8}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:MUTED,marginBottom:6}}>
            <span>Subtotal</span><span>₹{total.toLocaleString()}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:MUTED,marginBottom:6}}>
            <span>Shipping</span><span style={{color:shipping===0?'#2E7D32':'inherit'}}>{shipping===0?"FREE ✓":"₹"+shipping}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:BLACK,marginTop:8,paddingTop:8,borderTop:"1px solid #EDE5D8"}}>
            <span>Total</span><span>₹{(total+shipping).toLocaleString()}</span>
          </div>
        </div>
        <button className="place-btn" onClick={submit} disabled={placing}
          style={{opacity:placing?0.6:1, cursor:placing?"not-allowed":"pointer"}}>
          {placing ? "Placing Order..." : `📱 Place Order via WhatsApp — ₹${(total+shipping).toLocaleString()}${shipping===0?" (Free Shipping)":""}`}
        </button>
      </div>
    </div>
  );
}

function SuccessModal({ open, order, onClose }) {
  if(!open||!order) return null;
  return (
    <div className="modal-overlay open" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="success-modal">
        <div className="success-ico">🎉</div>
        <h2>Almost Done!</h2>
        <p style={{marginBottom:6}}>Thank you, <strong>{order.name}</strong>!<br/>
        {order.orderId && <>Order <strong>#{order.orderId}</strong> is ready.<br/></>}</p>
        <p style={{fontSize:13,color:MUTED,marginBottom:20,lineHeight:1.6}}>
          Tap the button below to send your order on WhatsApp.<br/>
          Your order details are already filled in — just press <strong>Send</strong>.
        </p>
        {order.waUrl && (
          <a href={order.waUrl} target="_blank" rel="noopener noreferrer"
            style={{display:"block",width:"100%",background:"#25D366",color:"#fff",
              textAlign:"center",padding:"14px",fontFamily:"'Inter',sans-serif",
              fontSize:14,letterSpacing:".06em",textDecoration:"none",
              fontWeight:600,marginBottom:12,boxSizing:"border-box"}}>
            📲 Send Order on WhatsApp
          </a>
        )}
        <button className="btn-dark" style={{width:"100%",marginBottom:10}} onClick={onClose}>Continue Shopping</button>
      </div>
    </div>
  );
}

function ColourMatcher({ open, onClose, hijabProducts, onAdd }) {
  const fileRef = useRef(null);
  const [tab, setTab] = useState("pick");
  const [pendingColour, setPendingColour] = useState(null);
  const [dressHex, setDressHex] = useState(null);
  const [dressLabel, setDressLabel] = useState("");
  const [matches, setMatches] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  function describeColourName(hex) {
    if (!hex || hex.length < 7) return 'Unknown';
    const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
    const max=Math.max(r,g,b)/255, min=Math.min(r,g,b)/255;
    const l=(max+min)/2;
    const d=max-min;
    const s=d===0?0:(l>0.5?d/(2-max-min):d/(max+min));
    if(s<0.1){if(l>0.85)return 'White';if(l>0.6)return 'Light Grey';if(l>0.4)return 'Grey';if(l>0.2)return 'Dark Grey';return 'Black';}
    let h=0;
    const rn=r/255,gn=g/255,bn=b/255,mx=Math.max(rn,gn,bn),mn=Math.min(rn,gn,bn),di=mx-mn;
    switch(mx){case rn:h=((gn-bn)/di+6)%6;break;case gn:h=(bn-rn)/di+2;break;case bn:h=(rn-gn)/di+4;break;}
    h=h/6*360;
    let base;
    if(h<8||h>=348){
      if(l>0.63)base='Coral Pink';
      else if(l>0.50)base='Coral';
      else if(l>0.40)base='Deep Coral';
      else base='Red';
    } else if(h<14){
      if(l>0.60)base='Salmon';
      else if(l>0.45)base='Coral';
      else base=l<0.35?'Dark Rust':'Rust';
    }
    else if(h<36)base=l<0.52?'Burnt Orange':'Orange Red';
    else if(h<50)base=l<0.45?'Dark Orange':'Orange';
    else if(h<65)base=s>0.6?'Amber':'Mustard';
    else if(h<80)base='Yellow';
    else if(h<100)base=l<0.35?'Olive':'Yellow Green';
    else if(h<140)base=l<0.3?'Forest Green':'Green';
    else if(h<165)base='Teal';
    else if(h<195)base='Cyan';
    else if(h<225)base=l<0.35?'Navy Blue':'Sky Blue';
    else if(h<255)base=l<0.35?'Navy':'Blue';
    else if(h<285)base=l<0.3?'Deep Purple':'Purple';
    else if(h<315)base=l<0.3?'Dark Magenta':'Magenta';
    else base=l<0.35?'Dark Rose':'Rose';
    if(l<0.22)return 'Deep '+base;
    if(l<0.48&&s>0.5)return 'Rich '+base;
    if(l>0.75)return 'Light '+base;
    if(s<0.35)return 'Dusty '+base;
    return base;
  }

  function hexToHsl(hex) {
    if (!hex || hex.length < 7) return { h: 0, s: 0, l: 0 };
    const r = parseInt(hex.slice(1,3),16)/255;
    const g = parseInt(hex.slice(3,5),16)/255;
    const b = parseInt(hex.slice(5,7),16)/255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let h = 0, s = 0;
    const l = (max+min)/2;
    if (max !== min) {
      const d = max-min;
      s = l > 0.5 ? d/(2-max-min) : d/(max+min);
      switch(max) {
        case r: h = ((g-b)/d + (g<b?6:0))/6; break;
        case g: h = ((b-r)/d + 2)/6; break;
        case b: h = ((r-g)/d + 4)/6; break;
      }
    }
    return { h: h*360, s: s*100, l: l*100 };
  }

  function findMatches(hex, colours) {
    const d = hexToHsl(hex);
    const NEUTRAL_NAMES = new Set([
      "Black","Charcoal","Silver Grey","Nude Grey","Fossil Grey","Dark Grey","Silver",
      "Slate","Lava","Off White","Milk White","Beige","Nude","Nude Peach","Oats",
      "Ivory","Eggshell","Pearl Cream","Sandal Cream","Beige #01","Light Ivory",
      "Nude Silver","Nude #02","Nude #03","Denim Nude","Mushroom","Nude Sage"
    ]);
    const neutrals = [], similar = [], complementary = [];
    colours.forEach(c => {
      if (!c.hex) return;
      if (NEUTRAL_NAMES.has(c.name)) { neutrals.push(c); return; }
      const h = hexToHsl(c.hex);
      if (h.s < 14) { neutrals.push(c); return; }
      const diff = Math.min(Math.abs(d.h - h.h), 360 - Math.abs(d.h - h.h));
      if (diff < 60) similar.push({ ...c, _score: diff });
      else if (diff >= 130 && diff <= 230) complementary.push({ ...c, _score: Math.abs(diff-180) });
    });
    similar.sort((a,b) => a._score - b._score);
    complementary.sort((a,b) => a._score - b._score);
    // Closest matches by RGB distance (top 5)
    function rgbDist(h1,h2){
      const a=parseInt(h1.slice(1,3),16)-parseInt(h2.slice(1,3),16);
      const b=parseInt(h1.slice(3,5),16)-parseInt(h2.slice(3,5),16);
      const c=parseInt(h1.slice(5,7),16)-parseInt(h2.slice(5,7),16);
      return Math.sqrt(a*a+b*b+c*c);
    }
    const closestAll=colours
      .filter(c=>c.hex&&c.hex!==GOLD)
      .map(c=>({...c,_dist:rgbDist(hex,c.hex)}))
      .sort((a,b)=>a._dist-b._dist)
      .slice(0,6);
    return {
      closest: closestAll,
      neutrals: neutrals.slice(0, 12),
      similar: similar.slice(0, 16),
      complementary: complementary.slice(0, 10),
    };
  }

  function applyColour(hex, label) {
    setDressHex(hex);
    setDressLabel(label);
    const firstHijab = hijabProducts && hijabProducts[0];
    if (!firstHijab) return;
    try {
      const swatches = firstHijab.colours.length > 0 && typeof firstHijab.colours[0] === 'object'
        ? firstHijab.colours
        : toSwatches(firstHijab.colours);
      setMatches(findMatches(hex, swatches));
    } catch(err) {
      console.error('Matcher error:', err);
    }
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';
    setUploading(true);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    const img = new Image();
    img.onerror = () => { setUploading(false); alert('Could not read that image. Please try another.'); };
    img.onload = () => {
      try {
        const W = 220, H = 220;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = W; canvas.height = H;
        ctx.drawImage(img, 0, 0, W, H);
        const data = ctx.getImageData(0, 0, W, H).data;

        // ── Step 1: collect qualifying pixels — skip near-white, near-black, near-grey ──
        const pixels = [];
        const cx0 = Math.floor(W*0.10), cx1 = Math.floor(W*0.90);
        const cy0 = Math.floor(H*0.06), cy1 = Math.floor(H*0.94);
        for (let y = cy0; y < cy1; y++) {
          for (let x = cx0; x < cx1; x++) {
            const i = (y*W+x)*4;
            const r = data[i], g = data[i+1], b = data[i+2];
            const br = (r+g+b)/3;
            if (br > 238 || br < 10) continue;
            const mx = Math.max(r,g,b), mn = Math.min(r,g,b);
            const sat = mx === 0 ? 0 : (mx-mn)/mx;
            if (sat < 0.10) continue;
            const l = (mx+mn)/2/255;
            if (l > 0.82) continue;
            pixels.push([r, g, b]);
          }
        }
        if (pixels.length < 10) throw new Error('No colour pixels found');

        // ── Step 2: k-means clustering (k=4) — finds actual colour groups ──
        const K = 4;
        let centroids = [0,1,2,3].map(k => [...pixels[Math.floor(k * (pixels.length-1) / (K-1))]]);
        let assignments = new Array(pixels.length).fill(0);
        for (let iter = 0; iter < 15; iter++) {
          let changed = false;
          for (let p = 0; p < pixels.length; p++) {
            const [r,g,b] = pixels[p];
            let best = 0, bestD = Infinity;
            for (let k = 0; k < K; k++) {
              const dr=r-centroids[k][0], dg=g-centroids[k][1], db=b-centroids[k][2];
              const d = dr*dr + dg*dg + db*db;
              if (d < bestD) { bestD = d; best = k; }
            }
            if (assignments[p] !== best) { assignments[p] = best; changed = true; }
          }
          if (!changed) break;
          const sums = Array.from({length:K}, ()=>[0,0,0]);
          const counts = new Array(K).fill(0);
          for (let p = 0; p < pixels.length; p++) {
            const k = assignments[p];
            sums[k][0] += pixels[p][0]; sums[k][1] += pixels[p][1]; sums[k][2] += pixels[p][2];
            counts[k]++;
          }
          for (let k = 0; k < K; k++) {
            if (counts[k] > 0) centroids[k] = sums[k].map(v => v / counts[k]);
          }
        }

        // ── Step 3: pick the most vibrant cluster (garment colour beats background) ──
        const sizes = new Array(K).fill(0);
        for (const a of assignments) sizes[a]++;
        let bestK = 0, bestScore = -1;
        for (let k = 0; k < K; k++) {
          if (sizes[k] === 0) continue;
          const [r,g,b] = centroids[k];
          const mx = Math.max(r,g,b), mn = Math.min(r,g,b);
          const sat = mx === 0 ? 0 : (mx-mn)/mx;
          const sizeFrac = sizes[k] / pixels.length;
          // High saturation wins; size is a tiebreaker via cube-root scaling
          const score = sat * sat * Math.cbrt(sizeFrac);
          if (score > bestScore) { bestScore = score; bestK = k; }
        }

        const [r,g,b] = centroids[bestK].map(v => Math.max(0, Math.min(255, Math.round(v))));
        const toHex = v => v.toString(16).padStart(2, '0');
        const hex = '#' + toHex(r) + toHex(g) + toHex(b);
        setUploading(false);
        applyColour(hex, describeColourName(hex));
      } catch(err) {
        console.error('Colour extraction failed:', err);
        setUploading(false);
      }
    };
    img.src = url;
  }

  function handleChipClick(colourObj) {
    if (!hijabProducts || !hijabProducts.length) return;
    setPendingColour(colourObj);
  }

  if (!open) return null;

  const MatchSection = ({ label, items }) => items.length === 0 ? null : (
    <div className="match-section">
      <p className="match-section-lbl">✦ {label}</p>
      <div className="match-swatches">
        {items.map(c => (
          <div key={c.name} className="match-chip" onClick={() => handleChipClick(c)} title="Click to add to cart">
            <div className="match-dot" style={{background: c.hex, border:'1px solid rgba(0,0,0,.08)'}} />
            <span className="match-name">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const totalMatches = matches ? (matches.closest||[]).length + matches.similar.length + matches.complementary.length + matches.neutrals.length : 0;

  return (
    <div className="matcher-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="matcher" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <p style={{fontSize:9,letterSpacing:'.3em',textTransform:'uppercase',color:GOLD,marginBottom:8}}>Styling Tool</p>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,marginBottom:6,color:BLACK}}>Find Your Perfect Hijab Match</h3>
        <p style={{fontSize:13,color:MUTED,marginBottom:24,lineHeight:1.7}}>Tell us your dress colour — we'll show you hijab shades that pair beautifully.</p>

        <div className="matcher-tabs">
          <button className={`matcher-tab${tab==="pick"?" active":""}`} onClick={() => setTab("pick")}>Pick Dress Colour</button>
          <button className={`matcher-tab${tab==="photo"?" active":""}`} onClick={() => setTab("photo")}>Upload Outfit Photo</button>
        </div>

        {tab === "pick" && (
          <div>
            <p style={{fontSize:11,color:MUTED,marginBottom:14,letterSpacing:'.03em'}}>Select the colour closest to your dress:</p>
            <div className="dress-palette">
              {DRESS_PALETTE.map(d => (
                <div key={d.name}
                  className="dress-swatch"
                  style={{
                    background: d.hex,
                    outline: dressHex===d.hex ? `3px solid #1A1A1A` : '3px solid transparent',
                    outlineOffset: 2,
                    transform: dressHex===d.hex ? 'scale(1.2)' : undefined,
                  }}
                  title={d.name}
                  onClick={() => applyColour(d.hex, d.name)}
                />
              ))}
            </div>
          </div>
        )}

        {tab === "photo" && (
          <div className="upload-zone" style={{position:'relative'}}>
            {/* Invisible file input covers the entire zone — most reliable cross-browser approach */}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              onClick={e => e.stopPropagation()}
              style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0,cursor:'pointer',zIndex:2}}
            />
            {uploading ? (
              <p style={{color:MUTED,fontSize:13}}>Analysing your outfit colour…</p>
            ) : previewUrl ? (
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,pointerEvents:'none'}}>
                <img src={previewUrl} alt="outfit" style={{width:90,height:90,objectFit:'cover',borderRadius:8,border:'2px solid #EDE5D8'}} />
                {dressHex && <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:24,height:24,borderRadius:'50%',background:dressHex,border:'1px solid rgba(0,0,0,.1)'}}/>
                  <span style={{fontSize:12,color:MUTED}}>Colour extracted · tap to change photo</span>
                </div>}
              </div>
            ) : (
              <div style={{pointerEvents:'none'}}>
                <div style={{fontSize:36,marginBottom:10}}>📸</div>
                <p style={{fontSize:13,color:MUTED,lineHeight:1.7,margin:0}}>Tap to upload a photo of your outfit<br/><span style={{fontSize:11}}>We'll extract the dominant colour automatically</span></p>
              </div>
            )}
          </div>
        )}

        {/* ── Hijab type picker ── */}
        {pendingColour && (
          <div style={{marginTop:20}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,padding:'10px 14px',background:'#F5F0E8'}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:pendingColour.hex,border:'1px solid rgba(0,0,0,.1)',flexShrink:0}}/>
              <span style={{fontSize:12,color:'#1A1A1A',fontWeight:500}}>{pendingColour.name}</span>
              <button onClick={()=>setPendingColour(null)} style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',fontSize:13,color:'#8A8278'}}>← Back</button>
            </div>
            <p style={{fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',color:'#8A8278',marginBottom:12}}>✦ Choose Your Hijab Style</p>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {hijabProducts.map(p=>(
                <div key={p.id} onClick={()=>{onAdd(p,pendingColour);setPendingColour(null);onClose();}}
                  style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',border:'1px solid #EDE5D8',cursor:'pointer',transition:'border-color .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='#C9A96E'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='#EDE5D8'}>
                  <div style={{flex:1}}>
                    <p style={{fontSize:13,fontWeight:500,color:'#1A1A1A',marginBottom:2}}>{p.name}</p>
                    <p style={{fontSize:11,color:'#8A8278'}}>{p.description ? p.description.split('.')[0] : ''}</p>
                  </div>
                  <p style={{fontSize:14,fontWeight:600,color:'#1A1A1A',flexShrink:0}}>₹{p.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {dressHex && matches && !pendingColour && (
          <div className="match-results">
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'#F5F0E8',marginBottom:20}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:dressHex,flexShrink:0,border:'2px solid #fff',boxShadow:'0 1px 4px rgba(0,0,0,.15)'}}/>
              <div>
                <p style={{fontSize:10,letterSpacing:'.15em',textTransform:'uppercase',color:MUTED,marginBottom:2}}>Your dress colour</p>
                <p style={{fontSize:13,color:BLACK,fontWeight:500}}>{dressLabel}</p>
              </div>
              <p style={{marginLeft:'auto',fontSize:11,color:MUTED,flexShrink:0}}>{totalMatches} matches</p>
            </div>

            <MatchSection label="Closest in Our Collection" items={matches.closest} />
            <MatchSection label="Same Tone Family" items={matches.similar} />
            <MatchSection label="Complementary Contrast" items={matches.complementary} />
            <MatchSection label="Always Matches — Neutrals" items={matches.neutrals} />

            <p style={{fontSize:11,color:MUTED,textAlign:'center',marginTop:16,paddingTop:16,borderTop:'1px solid #EDE5D8'}}>
              Click any shade to choose your hijab style
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [filter, setFilter] = useState("all");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [lookInitColour, setLookInitColour] = useState(null);
  const [matcherOpen, setMatcherOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [toast, setToast] = useState({msg:"",show:false});
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Live product data from Spring Boot backend ──
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [productsLoading, setProductsLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Retry up to 4 times with 5s delay — handles Railway cold starts (~10-30s)
      for (let attempt = 0; attempt < 4; attempt++) {
        if (cancelled) return;
        try {
          const data = await api.get("/products");
          if (cancelled) return;
          const mapped = data.map(p => ({
            id: p.id,
            cat: (p.category || "").toLowerCase(),
            name: p.name,
            price: p.price,
            badge: p.badge,
            desc: p.description,
            img: p.imageUrl,
            inStock: p.inStock !== false,
            unavailableColours: p.unavailableColours || [],
            colours: (p.colours && p.colours.length ? p.colours : ["Default"]).map(name => ({
              name,
              hex: COLOUR_HEX[name] || "#C9A96E",
            })),
            features: p.features || [],
          }));
          setProducts(mapped);
          setBackendOnline(true);
          if (!cancelled) setProductsLoading(false);
          return;
        } catch (err) {
          console.warn(`Backend attempt ${attempt + 1} failed:`, err.message);
          if (attempt < 3) {
            await new Promise(r => setTimeout(r, 5000)); // wait 5s before retry
          } else {
            if (!cancelled) {
              setBackendOnline(false);
              setProducts(FALLBACK_PRODUCTS);
              setProductsLoading(false);
            }
          }
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const showToast = (msg) => {
    setToast({msg,show:true});
    setTimeout(()=>setToast(p=>({...p,show:false})),2500);
  };

  const addToCart = (product, colour) => {
    setCart(prev => {
      const key = `${product.id}-${colour.name}`;
      const ex = prev.find(i=>i.cartId===key);
      if(ex) return prev.map(i=>i.cartId===key?{...i,qty:i.qty+1}:i);
      return [...prev, {...product, cartId:key, colour:colour.name, qty:1}];
    });
    showToast(`${product.name} added to cart ✓`);
  };

  const changeQty = (cartId, delta) => {
    setCart(prev => prev.map(i=>i.cartId===cartId
      ? {...i, qty:Math.max(1,i.qty+delta)} : i));
  };

  const removeItem = (cartId) => setCart(prev=>prev.filter(i=>i.cartId!==cartId));

  const filtered = filter==="all" ? products
    : products.filter(p=>p.cat===filter);

  const nav = (p) => { setPage(p); setMenuOpen(false); window.scrollTo(0,0); };
  const totalQty = cart.reduce((s,i)=>s+i.qty,0);

  const scrollTo = (id) => {
    nav("home");
    setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"}),100);
  };

  return (
    <>
      <style>{css}</style>

      {/* Mobile Menu */}
      <div className={`mmenu ${menuOpen?"":"hide"}`}>
        <button className="mclose" onClick={()=>setMenuOpen(false)}>✕</button>
        {[["home","Home"],["shop","Shop"],["about","About"],["contact","Contact"]].map(([p,l])=>(
          <button key={p} onClick={()=>{p==="about"?scrollTo("about"):p==="contact"?scrollTo("contact"):nav(p)}}>{l}</button>
        ))}
      </div>

      {/* Nav */}
      <nav className="nav">
        <div className="logo" onClick={()=>nav("home")}>Yasatika<span>·</span>Styles</div>
        <ul className="nav-links">
          <li><button onClick={()=>nav("home")}>Home</button></li>
          <li><button onClick={()=>nav("shop")}>Shop</button></li>
          <li><button onClick={()=>scrollTo("about")}>About</button></li>
          <li><button onClick={()=>scrollTo("contact")}>Contact</button></li>
        </ul>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <button className="cart-btn" onClick={()=>setCartOpen(true)}>
            🛍
            {totalQty>0&&<span className="cart-badge">{totalQty}</span>}
          </button>
          <button className="burger" onClick={()=>setMenuOpen(true)}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* Cart */}
      <CartDrawer cart={cart} open={cartOpen} onClose={()=>setCartOpen(false)}
        onQty={changeQty} onRemove={removeItem}
        onCheckout={()=>{setCartOpen(false);setCheckoutOpen(true);}} />

      {/* Modals */}
      <ProductModal product={modalProduct} open={!!modalProduct}
        onClose={()=>{setModalProduct(null);setLookInitColour(null);}} onAdd={addToCart} initialColour={lookInitColour} />
      <ColourMatcher
        open={matcherOpen}
        onClose={()=>setMatcherOpen(false)}
        hijabProducts={products.filter(p=>p.cat==="hijab")}
        onAdd={(prod,colourObj)=>addToCart(prod, colourObj)}
      />
      <CheckoutModal open={checkoutOpen} cart={cart}
        onClose={()=>setCheckoutOpen(false)}
        onSuccess={(form)=>{setCheckoutOpen(false);setCart([]);setSuccessOrder(form);}} />
      <SuccessModal open={!!successOrder} order={successOrder}
        onClose={()=>setSuccessOrder(null)} />

      {/* Toast */}
      <Toast msg={toast.msg} show={toast.show} />


      {/* ══ HOME PAGE ══ */}
      {page==="home" && <>

        {/* Hero */}
        <section className="hero">
          <div className="hero-l">
            <p className="hero-eye">Luxury · Modest · Timeless</p>
            <h1 className="hero-h">Adorned in<br/><em>Quiet</em><br/>Elegance</h1>
            <p className="hero-p">Premium hijabs and anti-tarnish jewellery for the woman who carries grace in every detail.</p>
            <div className="hero-btns">
              <button className="btn-dark" onClick={()=>nav("shop")}>Shop Now</button>
              <button className="btn-gold" onClick={()=>scrollTo("about")}>Our Story</button>
              <button className="btn-gold" style={{display:'flex',alignItems:'center',gap:7}} onClick={()=>setMatcherOpen(true)}>
                ✦ Colour Match
              </button>
            </div>
          </div>
          <div className="hero-r">
            <img src={IMGS.hijabWomen} alt="Women wearing premium hijabs" />
          </div>
        </section>

        {/* Strip */}
        <div className="strip">
          {["Premium Fabrics","Anti-Tarnish Guarantee","Free Shipping within Kerala","Curated Collections","Easy Exchange"].map(t=>(
            <span key={t}>{t}</span>
          ))}
        </div>

        {/* Featured Products */}
        <section className="sec">
          <div className="inner">
            <p className="sec-lbl">Featured</p>
            <h2 className="sec-h">Our <em>Bestsellers</em></h2>
            <div className="prod-grid" style={{marginTop:40}}>
              {products.filter(p=>p.badge).map(p=>(
                <ProductCard key={p.id} p={p} onAdd={addToCart} onView={setModalProduct} />
              ))}
            </div>
            <div style={{textAlign:"center",marginTop:40}}>
              <button className="btn-dark" onClick={()=>nav("shop")}>View All Products</button>
            </div>
          </div>
        </section>

        {/* Hijab Colour Grid */}
        <section className="sec" style={{background:BEIGE,paddingTop:0}}>
          <div className="inner">
            <p className="sec-lbl">The Hijab Collection</p>
            <h2 className="sec-h">17+ Colours,<br/><em>One Perfect Drape</em></h2>
          </div>
          <div className="look-grid" style={{marginTop:40}}>
            {[
              {img:"hijabWine",lbl:"Wine & Burgundy"},
              {img:"hijabPurple",lbl:"Purple & Lavender"},
              {img:"hijabGreen",lbl:"Forest & Navy"},
              {img:"hijabEarthy",lbl:"Earthy & Olive"},
              {img:"hijabNeutral",lbl:"Must-Have Neutrals"},
              {img:"hijabGrey",lbl:"Grey & Charcoal"},
            ].map((x,i)=>(
              <div key={i} className="look-item">
                <div className="look-img-wrap" onClick={()=>nav("shop")}>
                  <img src={IMGS[x.img]} alt={x.lbl} />
                  <span className="look-lbl">{x.lbl}</span>
                </div>
                <div className="look-info">
                  <div className="look-swatches">
                    {(LOOK_COLOURS[x.img]||[]).map(name=>{
                      const hex=COLOUR_HEX[name]||"#C9A96E";
                      return(<div key={name} className="swatch"
                        style={{background:hex,width:20,height:20,cursor:"pointer"}}
                        title={name}
                        onClick={()=>{
                          const hijab=products.find(p=>p.cat==="hijab")||FALLBACK_PRODUCTS[0];
                          setLookInitColour(hijab.colours.find(c=>c.name===name)||{name,hex});
                          setModalProduct(hijab);
                        }}/>);
                    })}
                  </div>
                  <button className="look-btn" onClick={()=>{
                    const hijab=products.find(p=>p.cat==="hijab")||FALLBACK_PRODUCTS[0];
                    setLookInitColour(null);setModalProduct(hijab);
                  }}>Shop This Shade →</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy */}
        <section className="phil">
          <p className="phil-ey">Our Philosophy</p>
          <h2 className="phil-h">
            <em>Every piece tells a story</em><br/>of a woman who chose <strong>herself</strong>.
          </h2>
          <p className="phil-p">Fashion is personal. At YasatikaStyles, we curate for women who seek clothing and adornment as intentional as they are.</p>
        </section>

        {/* Jewellery Showcase */}
        <section className="sec" id="jewellery">
          <div className="inner">
            <p className="sec-lbl">Anti-Tarnish Jewellery</p>
            <h2 className="sec-h">Brilliance<br/><em>That Endures</em></h2>
            <p className="body-p" style={{maxWidth:500,marginTop:12}}>
              Engineered to keep its shine through every season. No fading, no discolouration.
            </p>
          </div>
          <div className="jew-grid" style={{marginTop:40}}>
            <div className="jew-main">
              <img src={IMGS.jewHeart} alt="Gold heart necklace" />
              <span className="img-lbl">Heart Necklace Collection</span>
            </div>
            <div className="jew-side">
              <img src={IMGS.jewNecklace} alt="Gold necklace set" />
              <span className="img-lbl">Pendant Collection</span>
            </div>
            <div className="jew-side">
              <img src={IMGS.jewCharm} alt="Charm necklace" />
              <span className="img-lbl">Charm Collection</span>
            </div>
          </div>
          <div style={{position:"relative",overflow:"hidden",height:380,marginTop:3}}>
            <img src={IMGS.jewEarrings} alt="Gold earrings"
              style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 25%"}} />
            <div style={{position:"absolute",inset:0,
              background:"linear-gradient(to right,rgba(10,10,10,.6) 0%,transparent 55%)",
              display:"flex",alignItems:"center",padding:"0 56px"}}>
              <div>
                <p style={{fontSize:10,letterSpacing:".3em",textTransform:"uppercase",color:GOLD,marginBottom:12}}>New Arrival</p>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(26px,4vw,52px)",fontWeight:300,color:"#fff",lineHeight:1.1}}>
                  Gold Earrings<br/><em style={{fontStyle:"italic"}}>That Never Fade</em>
                </h3>
                <button className="btn-gold" style={{marginTop:20}} onClick={()=>nav("shop")}>Shop Earrings</button>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="sec" id="about" style={{background:BEIGE}}>
          <div className="inner">
            <p className="sec-lbl">The Founder</p>
            <h2 className="sec-h">Aysha Humaira —<br/><em>Engineer by Degree,<br/>Creator by Soul</em></h2>
            <div className="about-grid">
              <div className="about-vis">
                <img src="/yasatika-logo.png.jpg" alt="Yasatika Styles" style={{objectFit:"contain",objectPosition:"center",background:"#1E2A4A",borderRadius:8}} />
                <div className="about-accent" />
                <div className="about-quote">
                  <p className="about-qt">"I built a career in code — but my heart always spoke in colour, fabric, and faith."</p>
                  <p className="about-qa">— Aysha Humaira, Founder</p>
                </div>
              </div>
              <div>
                <p className="sec-lbl">Est. with Purpose</p>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(24px,3vw,40px)",fontWeight:300,lineHeight:1.1,color:BLACK}}>
                  Crafted for the <em style={{fontStyle:"italic",color:GOLD}}>Modern Woman</em>
                </h3>
                <p className="body-p">
                  My name is Aysha Humaira. I am a BTech graduate working as a Software Engineer — a world of logic, systems, and code. But woven into every line of that life was a quieter passion: a love for modest fashion, for the beauty of a perfectly draped hijab, for jewellery that lasts as long as the memories made wearing it.
                </p>
                <p className="body-p" style={{marginTop:14}}>
                  YasatikaStyles is that passion made real. It is my answer — why should modest fashion ever mean settling for less? Every piece I curate, I choose as though choosing for myself.
                </p>
                <div style={{marginTop:36,display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,letterSpacing:'.3em',textTransform:'uppercase',color:'#C9A96E'}}>Kerala</span>
                  <span style={{color:'rgba(0,0,0,.15)',fontSize:18}}>✦</span>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,letterSpacing:'.3em',textTransform:'uppercase',color:'#C9A96E'}}>Est. 2025</span>
                  <span style={{color:'rgba(0,0,0,.15)',fontSize:18}}>✦</span>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,letterSpacing:'.3em',textTransform:'uppercase',color:'#C9A96E'}}>Modest Luxury</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="sec ct-bg" id="contact">
          <div className="inner">
            <p className="sec-lbl">Get in Touch</p>
            <h2 className="ct-h">Begin Your<br/><em>Yasatika Journey</em></h2>
            <p className="ct-p">Reach out — we respond personally to every enquiry.</p>
            <div className="ct-cards">
              <a href="mailto:yasatikastyles@gmail.com" className="ct-card">
                <span className="ct-ico">✉</span>
                <span className="ct-lbl">Email Us</span>
                <span className="ct-val">yasatikastyles@gmail.com</span>
              </a>
              <a href="https://wa.me/919495330729" target="_blank" rel="noopener noreferrer" className="ct-card">
                <span className="ct-ico">📱</span>
                <span className="ct-lbl">WhatsApp</span>
                <span className="ct-val">+91 94953 30729</span>
              </a>
              <a href="https://instagram.com/yasatikastyles" target="_blank" rel="noopener noreferrer" className="ct-card">
                <span className="ct-ico">📸</span>
                <span className="ct-lbl">Instagram</span>
                <span className="ct-val">@yasatikastyles</span>
              </a>
            </div>
          </div>
        </section>
      </>}

      {/* ══ SHOP PAGE ══ */}
      {page==="shop" && (
        <div style={{minHeight:"100vh",paddingTop:61}}>
          <div style={{background:BEIGE,padding:"48px 48px 0"}}>
            <div className="inner">
              <p className="sec-lbl">All Products</p>
              <h2 className="sec-h">Shop <em>YasatikaStyles</em></h2>
              <div className="filter-tabs">
                {[["all","All"],["hijab","Hijabs"],["jewellery","Jewellery"]].map(([v,l])=>(
                  <button key={v} className={`tab ${filter===v?"active":""}`} onClick={()=>setFilter(v)}>{l}</button>
                ))}
               </div>
            </div>
          </div>
          <div className="sec" style={{paddingTop:40}}>
          <div className="inner">
            <div className="prod-grid" style={{marginTop:0}}>
              {filtered.map(p=>(
                <ProductCard key={p.id} p={p} onAdd={addToCart} onView={setModalProduct} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

      {/* Policy Banner */}
      <div className="policy-banner">
        <div className="policy-banner-inner">
          <p className="policy-banner-title">Our Promise</p>
          <h2 className="policy-banner-sub">Shipping, Returns <em>&amp; Exchange</em></h2>
          <div className="policy-cards">
            <div className="policy-card">
              <div className="policy-icon">🚚</div>
              <p className="policy-card-h">Shipping</p>
              <p className="policy-card-body">
                <strong style={{color:'#C9A96E',fontWeight:400}}>Free delivery</strong> across Kerala — no minimum order.<br/>
                Flat <strong style={{color:'#C9A96E',fontWeight:400}}>₹79</strong> for all other states in India.<br/>
                Orders are dispatched within 1–2 business days.
              </p>
              <p className="policy-card-note">✦ Tracking link shared via WhatsApp after dispatch</p>
            </div>
            <div className="policy-card">
              <div className="policy-icon">🔄</div>
              <p className="policy-card-h">Exchange Policy</p>
              <p className="policy-card-body">
                Exchange requests accepted within <strong style={{color:'#C9A96E',fontWeight:400}}>3 days</strong> of delivery.<br/>
                Item must be <strong style={{color:'#C9A96E',fontWeight:400}}>unused</strong>, unwashed, and in original packaging.<br/>
                Exchange is for a different colour or size of the same product.
              </p>
              <p className="policy-card-note">✦ No returns — exchange only</p>
            </div>
            <div className="policy-card">
              <div className="policy-icon">💬</div>
              <p className="policy-card-h">How to Exchange</p>
              <p className="policy-card-body">
                WhatsApp us at <strong style={{color:'#C9A96E',fontWeight:400}}>+91 94953 30729</strong> within 3 days.<br/>
                Share your order details and a photo of the item.<br/>
                We'll guide you through the process personally.
              </p>
              <p className="policy-card-note">✦ We respond within 24 hours</p>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="ft">
          <div>
            <div className="ft-logo">Yasatika<span>·</span>Styles</div>
            <div className="ft-tag">Modest Luxury · Premium Fashion</div>
          </div>
          <div className="ft-nav">
            <div>
              <h4>Navigate</h4>
              <ul>
                <li><button onClick={()=>nav("home")}>Home</button></li>
                <li><button onClick={()=>nav("shop")}>Shop All</button></li>
                <li><button onClick={()=>{nav("shop");setFilter("hijab")}}>Hijabs</button></li>
                <li><button onClick={()=>{nav("shop");setFilter("jewellery")}}>Jewellery</button></li>
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li><a href="mailto:yasatikastyles@gmail.com">yasatikastyles@gmail.com</a></li>
                <li><a href="https://wa.me/919495330729" target="_blank" rel="noopener noreferrer">+91 94953 30729</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="ft-bot">
          <span className="ft-copy">© 2025 YasatikaStyles. All rights reserved.</span>
          <div className="ft-soc">
            <a href="https://instagram.com/yasatikastyles" target="_blank" rel="noopener noreferrer">IG</a>
            <a href="https://wa.me/919495330729" target="_blank" rel="noopener noreferrer">WA</a>
          </div>
        </div>
      </footer>
    </>
  );
}
