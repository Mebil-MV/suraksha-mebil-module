import { useRef, useState } from 'react'
import { NavLink, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Circle, CircleMarker, Popup } from 'react-leaflet'
import {
  AlertTriangle, BellRing, Building2, ChevronLeft, ChevronRight, CloudRain,
  HandHeart, HeartHandshake, HeartPulse, Home, Languages, Layers3, Map,
  MapPin, MapPinned, Radio, ShieldCheck, ShieldAlert, TriangleAlert, User,
  Users, LogOut
} from 'lucide-react'
import { dashboard, incidents, hazards, exposure, shelters, communityTasks } from './mock/data'
import { sendSOS, submitIncident, submitAudit } from './services/mockServices'

function BottomNav() {
  const items = [
    ['/', 'Home', Home], ['/map', 'Map', Map], ['/beacon', 'Beacon', Radio],
    ['/safety', 'Safety Hub', ShieldCheck], ['/profile', 'Profile', User]
  ] as const
  return <nav className="bottom-nav">{items.map(([to,label,Icon]) => (
    <NavLink key={to} to={to} end={to==='/' } className={({isActive}) => `nav-item ${isActive?'active':''}`}>
      <Icon size={20}/><span>{label}</span>
    </NavLink>
  ))}</nav>
}

function PageHeader({title, subtitle, back=false}:{title:string, subtitle?:string, back?:boolean}) {
  const nav = useNavigate()
  return <header className="page-header">
    <div>{back && <button className="icon-button" onClick={()=>nav(-1)}><ChevronLeft size={20}/></button>}</div>
    <div className="page-header-copy"><div className="brand-line">SURAKSHA</div><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>
    <div/>
  </header>
}

function HomePage() {
  return <div className="page home-page">
    <section className="home-hero">
      <div><p className="eyebrow">SURAKSHA</p><h1>Good evening</h1><p className="muted">{dashboard.location} · {dashboard.area}</p></div>
      <div className="status-dot-wrap"><span className="status-dot"/>Online</div>
    </section>

    <section className="hazard-card">
      <div className="hazard-copy"><span className="pill warning">CURRENT HAZARD LEVEL</span><h2>{dashboard.hazardLevel}</h2><p>Stay alert. Conditions may change quickly.</p></div>
      <div className="gauge" style={{'--score': `${dashboard.hazardScore*3.6}deg`} as React.CSSProperties}><div><strong>{dashboard.hazardScore}</strong><span>/100</span></div></div>
    </section>

    <div className="indicator-grid">
      <Metric icon={<CloudRain size={20}/>} label="Rainfall" value={dashboard.rainfall} sub="Elevated"/>
      <Metric icon={<ShieldAlert size={20}/>} label="Landslide" value={dashboard.landslide} sub="Watch"/>
      <Metric icon={<AlertTriangle size={20}/>} label="Seismic" value={dashboard.seismic} sub="Stable"/>
    </div>

    <section className="connection-card">
      <div className="connection-icon"><Radio size={22}/></div>
      <div><strong>{dashboard.node.name}</strong><p>{dashboard.node.detail}</p></div>
      <span className="pill success">{dashboard.node.status}</span>
    </section>

    <section><div className="section-heading"><h2>Quick Actions</h2></div>
      <div className="quick-grid">
        <Link to="/report" className="quick-card"><AlertTriangle/><strong>Report Incident</strong><span>Send a geotagged field report</span></Link>
        <Link to="/audit-building" className="quick-card"><Building2/><strong>Audit Building</strong><span>Add exposure information</span></Link>
      </div>
    </section>

    <section><div className="section-heading"><h2>Recent Verified Activities</h2><Link to="/map">View map</Link></div>
      <div className="activity-list">{incidents.map(x => <Link key={x.id} to={`/incidents/${x.id}`} className="activity-card">
        <div className={`activity-icon ${x.severity}`}><AlertTriangle size={18}/></div>
        <div className="activity-copy"><strong>{x.title}</strong><span>{x.location} · {x.time}</span><small>{x.status}</small></div>
        <ChevronRight size={18}/>
      </Link>)}</div>
    </section>

    <section className="challenge-card"><span className="pill neutral">DAILY RESILIENCE CHALLENGE</span><h3>Know your nearest safe assembly point</h3><p>Open the map and identify the shelter closest to you.</p><Link to="/map" className="button secondary">Open map</Link></section>
  </div>
}

function Metric({icon,label,value,sub}:{icon:React.ReactNode,label:string,value:string,sub:string}) {
  return <div className="metric-card">{icon}<span>{label}</span><strong>{value}</strong><small>{sub}</small></div>
}

function MapPage() {
  const [layers,setLayers]=useState({hazards:true,exposure:true,incidents:true,shelters:true})
  const [panel,setPanel]=useState(true)
  const toggle=(k:keyof typeof layers)=>setLayers(v=>({...v,[k]:!v[k]}))
  return <div className="map-page">
    <div className="map-topbar"><div><p className="eyebrow">SURAKSHA WEBGIS</p><h1>Valley Map</h1></div><button className="icon-button" onClick={()=>setPanel(v=>!v)}><Layers3 size={20}/></button></div>
    <MapContainer center={[31.7095,76.9325]} zoom={15} scrollWheelZoom className="leaflet-map">
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      {layers.hazards && hazards.map(h=><Circle key={h.id} center={h.center} radius={h.radius} pathOptions={{color:'#b91c1c',fillColor:'#ef4444',fillOpacity:.25}}><Popup><b>{h.type}</b><br/>Severity: {h.severity}</Popup></Circle>)}
      {layers.exposure && exposure.map(a=><CircleMarker key={a.id} center={a.pos} radius={7} pathOptions={{color:'#1d4ed8',fillColor:'#3b82f6',fillOpacity:.9}}><Popup><b>{a.name}</b><br/>{a.type}</Popup></CircleMarker>)}
      {layers.incidents && incidents.map(i=><CircleMarker key={i.id} center={[i.lat,i.lng]} radius={8} pathOptions={{color:'#7f1d1d',fillColor:'#dc2626',fillOpacity:1}}><Popup><b>{i.title}</b><br/>{i.location}<br/>{i.status}</Popup></CircleMarker>)}
      {layers.shelters && shelters.map(s=><CircleMarker key={s.id} center={s.pos} radius={8} pathOptions={{color:'#14532d',fillColor:'#22c55e',fillOpacity:1}}><Popup><b>{s.name}</b><br/>{s.status} · {s.distance}</Popup></CircleMarker>)}
    </MapContainer>
    {panel && <div className="layers-panel"><strong>Layers</strong>{Object.entries(layers).map(([k,v])=><label key={k}><input type="checkbox" checked={v} onChange={()=>toggle(k as keyof typeof layers)}/><span>{k}</span></label>)}<div className="coming-soon">Slope gradient · Rainfall heatmap · Active road cuts plug in here later.</div></div>}
  </div>
}

function BeaconPage() {
  const [medical,setMedical]=useState(false), [trapped,setTrapped]=useState(false), [vulnerable,setVulnerable]=useState(false), [sent,setSent]=useState(false), [holding,setHolding]=useState(false)
  const timer=useRef<number|null>(null)
  const start=()=>{ if(sent) return; setHolding(true); timer.current=window.setTimeout(async()=>{await sendSOS({medical,trapped,vulnerable});setSent(true);setHolding(false)},1400)}
  const stop=()=>{ if(timer.current) window.clearTimeout(timer.current); timer.current=null; setHolding(false)}
  return <div className="page">
    <PageHeader title="Emergency Beacon" subtitle="Hold to transmit a distress signal"/>
    <div className={`sos-orb ${holding?'holding':''} ${sent?'sent':''}`}><button onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}><TriangleAlert size={40}/><strong>{sent?'SENT':'SOS'}</strong><span>{sent?'BEACON ACTIVE':'HOLD TO SEND'}</span></button></div>
    <p className="sos-help">{sent?'Emergency beacon is active. Keep this screen open where possible.':'Press and hold to reduce accidental emergency activation.'}</p>
    <section className="distress-card"><h2>Distress information</h2><Toggle icon={<HeartPulse size={20}/>} label="Medical assistance" value={medical} set={setMedical}/><Toggle icon={<TriangleAlert size={20}/>} label="Trapped by debris" value={trapped} set={setTrapped}/><Toggle icon={<Users size={20}/>} label="Children / elderly present" value={vulnerable} set={setVulnerable}/></section>
    <section className="telemetry-card"><div className="telemetry-title"><Radio size={20}/><div><strong>Node Hop Telemetry</strong><span>LoRa mesh route</span></div></div><div className="route-flow"><span>Node_01</span><b>→</b><span>Node_04 (Relay)</span><b>→</b><span>Sub-Center Base Station</span></div><div className="telemetry-status"><span className="status-dot"/>Connected · 3 hops</div></section>
  </div>
}

function Toggle({icon,label,value,set}:{icon:React.ReactNode,label:string,value:boolean,set:(v:boolean)=>void}) {
  return <div className="toggle-row"><div className="toggle-copy">{icon}<span>{label}</span></div><button className={`switch ${value?'on':''}`} onClick={()=>set(!value)}><span/></button></div>
}

function SafetyPage() {
  return <div className="page"><PageHeader title="Safety Hub" subtitle="Preparedness, response and recovery"/>
    <div className="feature-stack"><Link to="/claims" className="feature-card warm"><div className="feature-icon"><HandHeart size={24}/></div><div><span className="eyebrow">RECOVERY</span><h2>Relief & Claims</h2><p>Submit geotagged damage evidence and track the prototype recovery workflow.</p></div><ChevronRight/></Link><Link to="/community" className="feature-card green"><div className="feature-icon"><HeartHandshake size={24}/></div><div><span className="eyebrow">COMMUNITY</span><h2>Community Response</h2><p>See local support tasks and volunteer requirements.</p></div><ChevronRight/></Link></div>
    <section><div className="section-heading"><h2>Preparedness</h2></div><div className="tip-card"><ShieldCheck size={20}/><div><strong>During a landslide warning</strong><p>Move away from steep slopes, drainage channels and unstable road cuts.</p></div></div><div className="tip-card"><MapPinned size={20}/><div><strong>Know two routes</strong><p>Keep an alternate safe route in mind if your normal road is blocked.</p></div></div></section>
  </div>
}

function ProfilePage() {
  const [lang,setLang]=useState<'en'|'hi'>('en'), [offline,setOffline]=useState(true), [alerts,setAlerts]=useState(true)
  return <div className="page"><PageHeader title="Profile" subtitle="Responder identity and device settings"/>
    <section className="profile-card"><div className="avatar"><User size={30}/></div><div><h2>Suresh Thakur</h2><p>Kamand Valley · Registered Responder</p><span className="pill success">Kamand Scout</span></div></section>
    <section className="settings-card"><div className="setting-row"><div className="setting-label"><Radio size={19}/><div><strong>Connected device</strong><span>LoRa Node #02 · Mesh · 3 hops</span></div></div></div>
      <div className="setting-row"><div className="setting-label"><Languages size={19}/><div><strong>Language</strong><span>App interface language</span></div></div><div className="segmented"><button className={lang==='en'?'selected':''} onClick={()=>setLang('en')}>EN</button><button className={lang==='hi'?'selected':''} onClick={()=>setLang('hi')}>हि</button></div></div>
      <SettingToggle icon={<MapPinned size={19}/>} title="Offline valley maps" subtitle="Keep essential map areas available offline" value={offline} set={setOffline}/>
      <SettingToggle icon={<BellRing size={19}/>} title="Critical alert pushes" subtitle="Receive high-priority notifications" value={alerts} set={setAlerts}/>
    </section>
    <button className="button danger-outline full"><LogOut size={18}/>Sign out</button>
  </div>
}

function SettingToggle({icon,title,subtitle,value,set}:{icon:React.ReactNode,title:string,subtitle:string,value:boolean,set:(v:boolean)=>void}) {
  return <div className="setting-row"><div className="setting-label">{icon}<div><strong>{title}</strong><span>{subtitle}</span></div></div><button className={`switch ${value?'on':''}`} onClick={()=>set(!value)}><span/></button></div>
}

function ReportPage() {
  const [done,setDone]=useState(false), [type,setType]=useState('landslide'), [severity,setSeverity]=useState('moderate'), [description,setDescription]=useState('')
  const submit=async(e:React.FormEvent)=>{e.preventDefault();await submitIncident({type,severity,description,lat:31.7095,lng:76.9325});setDone(true)}
  return <div className="page"><PageHeader back title="Report Incident" subtitle="Create a geotagged community report"/>{done?<div className="success-panel"><h2>Report submitted</h2><p>It is <b>unverified</b> until checked.</p></div>:<form className="form-card" onSubmit={submit}><label>Incident type<select value={type} onChange={e=>setType(e.target.value)}><option value="landslide">Landslide</option><option value="flash_flood">Flash flood</option><option value="road_blockage">Road blockage</option><option value="infrastructure_damage">Infrastructure damage</option></select></label><label>Severity<select value={severity} onChange={e=>setSeverity(e.target.value)}><option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option></select></label><label>Description<textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="What happened?" required/></label><div className="location-box">Mock GPS: 31.7095, 76.9325<br/><span>Later: device GPS or map selection.</span></div><label>Photo<input type="file" accept="image/*"/></label><button className="button primary full">Submit report</button></form>}</div>
}

function AuditPage() {
  const [done,setDone]=useState(false)
  const submit=async(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();const f=new FormData(e.currentTarget);await submitAudit(Object.fromEntries(f.entries()));setDone(true)}
  return <div className="page"><PageHeader back title="Audit Building" subtitle="Add field exposure information"/>{done?<div className="success-panel"><h2>Audit saved</h2><p>This will later become an exposure record in PostGIS.</p></div>:<form className="form-card" onSubmit={submit}><label>Building type<select name="buildingType"><option>Residential</option><option>Institutional</option><option>Commercial</option><option>Critical infrastructure</option></select></label><label>Floors<input name="floors" type="number" min="1" defaultValue="2"/></label><label>Construction type<select name="constructionType"><option>RCC</option><option>Masonry</option><option>Timber</option><option>Mixed</option></select></label><label>Visible damage<select name="visibleDamage"><option>None</option><option>Minor</option><option>Moderate</option><option>Severe</option></select></label><label>Notes<textarea name="notes" placeholder="Slope proximity, retaining wall, access constraints..."/></label><label>Photo<input type="file" accept="image/*"/></label><div className="location-box">Mock GPS: 31.7095, 76.9325</div><button className="button primary full">Save audit</button></form>}</div>
}

function IncidentPage() {
  const {id}=useParams(); const x=incidents.find(i=>i.id===id)??incidents[0]
  return <div className="page"><PageHeader back title="Incident Details" subtitle="Verified field activity"/><section className="incident-hero"><div className={`activity-icon ${x.severity}`}><AlertTriangle/></div><div><span className="pill success">verified</span><h2>{x.title}</h2><p><MapPin size={15}/>{x.location}</p></div></section><section className="detail-card"><Detail label="Severity" value={x.severity}/><Detail label="Reported" value={x.time}/><Detail label="Response status" value={x.status}/><Detail label="Coordinates" value={`${x.lat}, ${x.lng}`}/></section><section className="detail-card"><h3>Description</h3><p>{x.description}</p></section><Link className="button primary full" to="/map">View on map</Link></div>
}
function Detail({label,value}:{label:string,value:string}) { return <div className="detail-row"><span>{label}</span><strong>{value}</strong></div> }

function ClaimsPage() {
  const [done,setDone]=useState(false)
  return <div className="page"><PageHeader back title="Relief & Claims" subtitle="Prototype damage and recovery workflow"/>{!done?<form className="form-card" onSubmit={e=>{e.preventDefault();setDone(true)}}><label>Loss type<select><option>Property damage</option><option>Road/access damage</option><option>Agricultural loss</option><option>Other</option></select></label><label>Description<textarea placeholder="Describe the damage..." required/></label><label>Geotagged evidence<input type="file" accept="image/*"/></label><div className="location-box">Mock location: 31.7095, 76.9325</div><button className="button primary full">Submit damage report</button></form>:<section className="claim-status"><span className="pill success">SUBMITTED</span><h2>Claim #SUR-981</h2><p>This is a Suraksha prototype workflow, not a government claim submission.</p><div className="timeline"><div className="timeline-step complete"><span/>Submitted</div><div className="timeline-step"><span/>Under review</div><div className="timeline-step"><span/>Approved / actioned</div></div></section>}</div>
}

function CommunityPage() {
  return <div className="page"><PageHeader back title="Community Response" subtitle="Local volunteer and support tasks"/><div className="task-list">{communityTasks.map(t=><article className="task-card" key={t.id}><div className="task-top"><span className={`pill ${t.priority==='High'?'danger':'warning'}`}>{t.priority}</span><small>{t.status}</small></div><h2>{t.title}</h2><p><MapPin size={15}/>{t.location}</p><p><Users size={15}/>{t.volunteers}</p><button className="button secondary full">View task</button></article>)}</div></div>
}

export default function App() {
  return <div className="app-bg"><main className="phone-shell"><div className="screen"><Routes>
    <Route path="/" element={<HomePage/>}/><Route path="/map" element={<MapPage/>}/><Route path="/beacon" element={<BeaconPage/>}/><Route path="/safety" element={<SafetyPage/>}/><Route path="/profile" element={<ProfilePage/>}/><Route path="/report" element={<ReportPage/>}/><Route path="/audit-building" element={<AuditPage/>}/><Route path="/incidents/:id" element={<IncidentPage/>}/><Route path="/claims" element={<ClaimsPage/>}/><Route path="/community" element={<CommunityPage/>}/>
  </Routes></div><Routes><Route path="/" element={<BottomNav/>}/><Route path="/map" element={<BottomNav/>}/><Route path="/beacon" element={<BottomNav/>}/><Route path="/safety" element={<BottomNav/>}/><Route path="/profile" element={<BottomNav/>}/></Routes></main></div>
}
