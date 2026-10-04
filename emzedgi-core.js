// emzedgi-core.js — MZG Emzedgi math-core (JS-порт Python v4)
// PUBLIC-safe: структура + example-нули. Реальные доли/цены — ТОЛЬКО в IndexedDB.
// Режим "Двойная (бленд-сэндвич)" = Shield(дно) + Body(стенки): два W/S, две плотности.
window.MZG_EMZEDGI = {
  schema: "4.1-public",
  rho_shield: 1.1, rho_body: 1.6, rho_wax: 0.92,   // [VERIFY_EXTERNAL]
  wall_factor: 0.45, shield_share: 0.15,
  ws_shield: 0.25, ws_body: 0.35,
  // ШАБЛОНЫ долей (в public = 0). Заполняются через вкладку "Материалы" -> IndexedDB.
  preset_shield_tpl: { chamotte:0, vermiculite:0, compact1:0, lime:0 },
  preset_body_tpl:   { lime:0, metakaolin:0, marble:0, quartz:0, perlite:0, compact1:0 },

  batchFromWaxMass(wax_g, presetShield, presetBody) {
    const cavity = wax_g / this.rho_wax;
    const concrete = cavity * this.wall_factor;
    const shield_ml = concrete * this.shield_share;
    const body_ml = concrete - shield_ml;
    const scale = (t, m) => Object.fromEntries(Object.entries(t).map(([k,v])=>[k,+(m*v).toFixed(1)]));
    const sum = o => Object.values(o).reduce((a,b)=>a+b,0);
    const sDry = shield_ml * this.rho_shield, bDry = body_ml * this.rho_body;
    return {
      schema: this.schema, mode: "double_sandwich",
      cavity_ml: +cavity.toFixed(1),
      shield: { dry_g:+sDry.toFixed(1), comps: scale(presetShield,sDry), water_g:+(sDry*this.ws_shield).toFixed(1) },
      body:   { dry_g:+bDry.toFixed(1), comps: scale(presetBody,bDry),   water_g:+(bDry*this.ws_body).toFixed(1) },
      wax_g,
      flags: { cure:"roman_natural_28d_RH95", perlite_in_body_only:true, vermiculite_in_shield_only:true, bevel_deg:15, wick_offset_mm:1.8 },
      _valid: Math.abs(sum(presetShield)-1) < 1e-6 && Math.abs(sum(presetBody)-1) < 1e-6
    };
  }
};
