export const dashboard = {
  location: 'Kamand Valley', area: 'North Campus', hazardLevel: 'Moderate', hazardScore: 62,
  rainfall: '42 mm/hr', landslide: 'Moderate', seismic: 'Normal',
  node: { name: 'LoRa Node #02', detail: 'Mesh · 3 Hops', status: 'Connected' }
}

export const incidents = [
  { id:'inc_083', title:'Landslide reported', type:'landslide', location:'Salgi Road bend', severity:'high', time:'23 min ago', status:'Team dispatched', lat:31.7084, lng:76.9328, description:'Fresh debris has partially blocked the uphill lane.' },
  { id:'inc_084', title:'Flash flood watch', type:'flash_flood', location:'Uhl tributary crossing', severity:'moderate', time:'1 hr ago', status:'Monitoring', lat:31.7131, lng:76.9278, description:'Water level rose rapidly after sustained rainfall.' },
  { id:'inc_085', title:'Road obstruction cleared', type:'road_blockage', location:'South access road', severity:'low', time:'3 hrs ago', status:'Resolved', lat:31.7047, lng:76.9354, description:'Loose debris was cleared and traffic movement restored.' }
]

export const hazards = [
  { id:'haz_001', center:[31.7092,76.9318] as [number,number], radius:380, type:'Landslide Hazard', severity:'High' },
  { id:'haz_002', center:[31.7134,76.9274] as [number,number], radius:260, type:'Flash Flood Watch', severity:'Moderate' }
]

export const exposure = [
  { id:'exp_01', name:'Hostel Block A', pos:[31.7102,76.9342] as [number,number], type:'Residential' },
  { id:'exp_02', name:'Academic Block', pos:[31.7069,76.9301] as [number,number], type:'Institutional' }
]

export const shelters = [
  { id:'sh_01', name:'Community Health Centre', pos:[31.7065,76.9360] as [number,number], status:'Open', distance:'850 m' },
  { id:'sh_02', name:'North Assembly Point', pos:[31.7141,76.9343] as [number,number], status:'Open', distance:'1.4 km' }
]

export const communityTasks = [
  { id:'task_01', title:'Deliver drinking water', location:'Salgi Road', priority:'High', volunteers:'3 / 5 assigned', status:'In progress' },
  { id:'task_02', title:'Check elderly residents', location:'North Campus', priority:'Moderate', volunteers:'2 / 3 assigned', status:'Open' }
]
