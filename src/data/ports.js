export const PORTS = {
  KRPUS: { id: 'KRPUS', name: 'Busan', country: 'KR', city: 'Busan', code: 'KRPUS', region: 'Asia', transportType: 'SEA', baseFreightMultiplier: 1, transitDays: 0 },
  KRINC: { id: 'KRINC', name: 'Incheon', country: 'KR', city: 'Incheon', code: 'KRINC', region: 'Asia', transportType: 'SEA', baseFreightMultiplier: 1.06, transitDays: 1 },
  KRKAN: { id: 'KRKAN', name: 'Gwangyang', country: 'KR', city: 'Gwangyang', code: 'KRKAN', region: 'Asia', transportType: 'SEA', baseFreightMultiplier: 1.04, transitDays: 1 },
  USLAX: { id: 'USLAX', name: 'Los Angeles', country: 'US', city: 'Los Angeles', code: 'USLAX', region: 'North America', transportType: 'SEA', baseFreightMultiplier: 1, transitDays: 16 },
  USLGB: { id: 'USLGB', name: 'Long Beach', country: 'US', city: 'Long Beach', code: 'USLGB', region: 'North America', transportType: 'SEA', baseFreightMultiplier: 1.02, transitDays: 16 },
  USNYC: { id: 'USNYC', name: 'New York', country: 'US', city: 'New York', code: 'USNYC', region: 'North America', transportType: 'SEA', baseFreightMultiplier: 1.18, transitDays: 28 },
  USSAV: { id: 'USSAV', name: 'Savannah', country: 'US', city: 'Savannah', code: 'USSAV', region: 'North America', transportType: 'SEA', baseFreightMultiplier: 1.12, transitDays: 26 },
  JPYOK: { id: 'JPYOK', name: 'Yokohama', country: 'JP', city: 'Yokohama', code: 'JPYOK', region: 'Asia', transportType: 'SEA', baseFreightMultiplier: 0.72, transitDays: 3 },
  JPTYO: { id: 'JPTYO', name: 'Tokyo', country: 'JP', city: 'Tokyo', code: 'JPTYO', region: 'Asia', transportType: 'SEA', baseFreightMultiplier: 0.74, transitDays: 3 },
  JPOSA: { id: 'JPOSA', name: 'Osaka', country: 'JP', city: 'Osaka', code: 'JPOSA', region: 'Asia', transportType: 'SEA', baseFreightMultiplier: 0.7, transitDays: 2 },
  CNSHA: { id: 'CNSHA', name: 'Shanghai', country: 'CN', city: 'Shanghai', code: 'CNSHA', region: 'Asia', transportType: 'SEA', baseFreightMultiplier: 0.68, transitDays: 2 },
  CNNGB: { id: 'CNNGB', name: 'Ningbo', country: 'CN', city: 'Ningbo', code: 'CNNGB', region: 'Asia', transportType: 'SEA', baseFreightMultiplier: 0.7, transitDays: 2 },
  CNSZX: { id: 'CNSZX', name: 'Shenzhen', country: 'CN', city: 'Shenzhen', code: 'CNSZX', region: 'Asia', transportType: 'SEA', baseFreightMultiplier: 0.76, transitDays: 4 },
  DEHAM: { id: 'DEHAM', name: 'Hamburg', country: 'DE', city: 'Hamburg', code: 'DEHAM', region: 'Europe', transportType: 'SEA', baseFreightMultiplier: 1.22, transitDays: 32 },
  NLRTM: { id: 'NLRTM', name: 'Rotterdam', country: 'NL', city: 'Rotterdam', code: 'NLRTM', region: 'Europe', transportType: 'SEA', baseFreightMultiplier: 1.2, transitDays: 30 },
  BEANR: { id: 'BEANR', name: 'Antwerp', country: 'BE', city: 'Antwerp', code: 'BEANR', region: 'Europe', transportType: 'SEA', baseFreightMultiplier: 1.21, transitDays: 31 },
  SGSIN: { id: 'SGSIN', name: 'Singapore', country: 'SG', city: 'Singapore', code: 'SGSIN', region: 'Asia', transportType: 'SEA', baseFreightMultiplier: 0.82, transitDays: 7 },
  VNSGN: { id: 'VNSGN', name: 'Ho Chi Minh (Cat Lai)', country: 'VN', city: 'Ho Chi Minh City', code: 'VNSGN', region: 'Asia', transportType: 'SEA', baseFreightMultiplier: 0.78, transitDays: 6 },
  AEJEA: { id: 'AEJEA', name: 'Jebel Ali', country: 'AE', city: 'Dubai', code: 'AEJEA', region: 'Middle East', transportType: 'SEA', baseFreightMultiplier: 1.05, transitDays: 18 },
  AEDXB: { id: 'AEDXB', name: 'Dubai', country: 'AE', city: 'Dubai', code: 'AEDXB', region: 'Middle East', transportType: 'SEA', baseFreightMultiplier: 1.08, transitDays: 18 },
}

export function getPort(id) {
  return PORTS[id]
}

export function listPorts(ids) {
  return ids.map((id) => PORTS[id]).filter(Boolean)
}
