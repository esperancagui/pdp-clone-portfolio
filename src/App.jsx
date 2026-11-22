import { useEffect, useRef, useState } from 'react'
import {
  ShoppingBag, Store, Ellipsis, Smartphone, UserRound, ChevronRight, ChevronLeft,
  ChevronUp, Truck, Info, Minus, Plus, Play, Star, ArrowUpToLine,
} from 'lucide-react'
import { product as p, related } from './data'

function useCountdown(start) {
  const [s, setS] = useState(start)
  useEffect(() => {
    const id = setInterval(() => setS((v) => (v > 0 ? v - 1 : start)), 1000)
    return () => clearInterval(id)
  }, [start])
  return [3600, 60, 1].map((d) => String(Math.floor(s / d) % (d === 3600 ? 100 : 60)).padStart(2, '0')).join(':')
}

function Section({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <section className="sec">
      <button className="sec-head" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <ChevronUp size={20} className={open ? '' : 'rot'} />
      </button>
      {open && children}
    </section>
  )
}

function Stars({ value }) {
  const v = parseFloat(value)
  return (
    <span className="stars">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, v - i)) * 100
        return (
          <span key={i} className="star">
            <Star size={12} strokeWidth={0} fill="#E0E0E0" />
            <span style={{ width: `${fill}%` }}><Star size={12} strokeWidth={0} fill="#FACE15" /></span>
          </span>
        )
      })}
    </span>
  )
}

export default function App() {
  const [img, setImg] = useState(p.images.length - 1)
  const [qty, setQty] = useState(1)
  const [descOpen, setDescOpen] = useState(false)
  const timer = useCountdown(11 * 3600 + 25 * 60 + 48)
  const thumbs = useRef(null)
  const cards = useRef(null)
  const [edge, setEdge] = useState([true, false])
  useEffect(() => { thumbs.current.scrollLeft = thumbs.current.scrollWidth }, [])
  const scrollBy = (ref, dx) => ref.current.scrollBy({ left: dx, behavior: 'smooth' })

  return (
    <>
      <aside className="side">
        <a href="/" className="side-logo" aria-label="Início"><ShoppingBag size={26} strokeWidth={2.4} /></a>
        <a href="https://seller-br.tiktok.com" className="side-btn" aria-label="Vender"><Store size={22} /></a>
        <button className="side-btn" aria-label="Mais"><Ellipsis size={22} /></button>
      </aside>

      <header className="top">
        <div className="pill">
          <a href="https://www.tiktok.com/download" className="pill-app"><Smartphone size={14} />Obter o aplicativo</a>
          <span className="pill-sep" />
          <span className="avatar"><UserRound size={18} /></span>
        </div>
      </header>

      <main className="wrap">
        <nav className="crumbs">
          {p.breadcrumb.map(([t, h]) => (
            <span key={t} className="crumb">
              <a href={h}>{t}</a>
              <ChevronRight size={14} />
            </span>
          ))}
          <span className="crumb-cur">{p.title}</span>
        </nav>

        <div className="pdp">
          <div className="left">
            <div className="main-img"><img src={p.images[img]} alt={p.title} /></div>
            <div className="timer">{timer}</div>
            <div className="thumbs-wrap">
              <button className="th-arrow l" onClick={() => scrollBy(thumbs, -234)}><ChevronLeft size={12} /></button>
              <div className="thumbs" ref={thumbs}>
                {p.images.map((src, i) => (
                  <button key={src} className={`thumb ${i === img ? 'on' : ''}`} onMouseEnter={() => setImg(i)} onClick={() => setImg(i)}>
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
              <button className="th-arrow r" onClick={() => scrollBy(thumbs, 234)}><ChevronRight size={12} /></button>
            </div>

            <h2 className="about">Sobre este produto</h2>
            <Section title="Detalhes">
              <dl className="details">
                {p.details.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
              </dl>
            </Section>
            <Section title="Descrição do produto">
              <div className={`desc ${descOpen ? 'open' : ''}`}>
                {p.description.map((l) => <p key={l}>{l}</p>)}
              </div>
              <div className="more"><button onClick={() => setDescOpen(!descOpen)}>{descOpen ? 'Ver menos' : 'Ver mais'}</button></div>
            </Section>
            <Section title="Vídeo">
              <div className="video">
                <img src={p.images[1]} alt="" />
                <span className="play"><Play size={18} fill="#fff" strokeWidth={0} /></span>
              </div>
            </Section>
          </div>

          <div className="right">
            <div className="buy">
              <div className="price">
                <span className="disc">{p.discount}</span>
                <span className="cur">R$</span><span className="int">{p.priceInt}</span><span className="cur">{p.priceDec}</span>
                <span className="old">{p.oldPrice}</span>
              </div>
              <div className="ship"><Truck size={20} />{p.shipping}</div>
              <h1 className="title">{p.title}</h1>
              <div className="muted">Vendido por {p.seller}</div>
              <div className="muted">{p.sold} <Info size={14} /></div>
              <div className="lbl">Modelo: <span>{p.variant}</span></div>
              <button className="variant">
                <img src={p.images[9]} alt="" />
                <span>{p.variant}</span>
              </button>
              <div className="qty">
                <span className="lbl">Quantidade:</span>
                <div className="stepper">
                  <button disabled={qty <= 1} onClick={() => setQty(qty - 1)}><Minus size={16} /></button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(qty + 1)}><Plus size={16} /></button>
                </div>
              </div>
              <button className="cta">teste</button>
            </div>
          </div>
        </div>

        <h2 className="explore">Explore mais de {p.seller}</h2>
        <div className="cards-wrap">
          <div className="cards" ref={cards} onScroll={(e) => {
            const el = e.currentTarget
            setEdge([el.scrollLeft < 4, el.scrollLeft + el.clientWidth > el.scrollWidth - 4])
          }}>
            {related.map((r) => (
              <a key={r.href} href={r.href} className="card">
                <div className="card-img"><img src={r.img} alt={r.title} loading="lazy" /></div>
                <div className="card-body">
                  <h3>{r.title}</h3>
                  <div className="rate">
                    {r.rating && <><b>{r.rating}</b><Stars value={r.rating} /><i /></>}
                    <span>{r.sold} vendido</span>
                  </div>
                  <div className="cprice">
                    <span className="cdisc">{r.discount}</span>
                    <span className="ccur">R$</span><span className="cint">{r.price.split(',')[0]}</span><span className="ccur">,{r.price.split(',')[1]}</span>
                    <span className="cold">R${r.oldPrice}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          {!edge[0] && <button className="cards-arrow l" onClick={() => scrollBy(cards, -1135)}><ChevronLeft size={16} /></button>}
          {!edge[1] && <button className="cards-arrow r" onClick={() => scrollBy(cards, 1135)}><ChevronRight size={16} /></button>}
        </div>
      </main>

      <footer className="foot">
        Projeto feito para currículo — clone de interface para fins de estudo, sem vínculo com o TikTok ou a TikTok Shop.
      </footer>

      <button className="to-top" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Voltar ao topo">
        <ArrowUpToLine size={16} />
      </button>
    </>
  )
}
