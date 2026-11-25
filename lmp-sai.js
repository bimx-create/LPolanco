(() => {
  const status = document.getElementById('sai-lmp-status');
  const pageSize = 200;
  let activeRequest;
  let lastSnapshot;

  function sessionOpen() {
    return document.getElementById('login-overlay').style.display === 'none';
  }

  function mostrarError(message = '') {
    status.textContent = message;
    status.hidden = !message;
  }

  async function refresh() {
    if (!sessionOpen() || document.hidden || activeRequest) return;
    const request = new AbortController();
    activeRequest = request;
    const timeout = setTimeout(() => request.abort(), 12000);
    try {
      const rowsById = new Map();
      let cursor;
      for (;;) {
        let query = supabaseClient.from('cotizaciones')
          .select('id,fecha_infusion,paciente,servicio,monto_del_servicio,sede,folio')
          .eq('marca', 'LMP').order('id', { ascending: true }).limit(pageSize);
        if (cursor !== undefined) query = query.gt('id', cursor);
        const { data, error } = await query.abortSignal(request.signal);
        if (error) throw error;
        if (!data.length) break;
        for (const row of data) rowsById.set(row.id, row);
        const nextCursor = data.at(-1).id;
        if (nextCursor === cursor) throw new Error('La consulta no avanzó.');
        cursor = nextCursor;
      }
      if (activeRequest !== request || !sessionOpen()) return;
      const rows = [...rowsById.values()].sort((a, b) =>
        (b.fecha_infusion || '').localeCompare(a.fecha_infusion || ''));
      const snapshot = JSON.stringify(rows);
      if (snapshot !== lastSnapshot) {
        actualizarEstudiosSai(rows.map(row => ({
          origenSai: true,
          fecha: row.fecha_infusion,
          nombre: row.paciente,
          estudio: row.servicio,
          monto: row.monto_del_servicio,
          folio: row.folio,
          notas: row.sede ? 'Sede: ' + row.sede : '',
          categoria: 'Polanco',
          estatus: 'Solventado'
        })));
        lastSnapshot = snapshot;
      }
      mostrarError();
    } catch {
      if (activeRequest === request && sessionOpen()) {
        const message = lastSnapshot === undefined
          ? 'No se pudo consultar Llenado SAI. Se volverá a intentar automáticamente.'
          : 'No se pudo actualizar. Se muestran los últimos datos recibidos de Llenado SAI.';
        mostrarError(message);
      }
    } finally {
      clearTimeout(timeout);
      if (activeRequest === request) activeRequest = undefined;
    }
  }

  document.addEventListener('polanco-session-change', () => {
    if (sessionOpen()) {
      refresh();
      return;
    }
    activeRequest?.abort();
    activeRequest = undefined;
    lastSnapshot = undefined;
    actualizarEstudiosSai([]);
    mostrarError();
  });
  document.addEventListener('polanco-tab-change', refresh);
  document.addEventListener('visibilitychange', refresh);
  setInterval(refresh, 15000);
  refresh();
})();
