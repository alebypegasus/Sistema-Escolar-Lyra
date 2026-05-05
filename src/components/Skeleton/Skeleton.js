/**
 * ========================================================
 * SKELETON UTILS
 * Gerador de HTML de carregamento para a estética Liquid Glass.
 * ========================================================
 */

export const Skeleton = {
  /**
   * Gera o esqueleto para os cards de disciplinas (Visão do Aluno)
   */
  getGridCards: (count = 3) => {
    let html = `<div class="grid-3-cols gap-24">`;
    for (let i = 0; i < count; i++) {
      html += `
        <div class="card skeleton-base" style="height: 200px;">
          <div class="skeleton-text" style="width: 60%; margin-top: 10px;"></div>
          <div class="skeleton-text" style="width: 40%;"></div>
          <div style="margin-top: auto;">
             <div class="skeleton-text" style="width: 100%; height: 40px; border-radius: 8px;"></div>
          </div>
        </div>
      `;
    }
    html += `</div>`;
    return html;
  },

  /**
   * Gera o esqueleto para a tabela de alunos (Visão do Professor)
   */
  getTableRows: (rows = 5) => {
    let html = `
      <div class="table-wrapper skeleton-base" style="padding: 16px;">
        <div class="skeleton-text" style="width: 30%; height: 24px; margin-bottom: 20px;"></div>
        <div class="flex-col gap-12">
    `;
    for (let i = 0; i < rows; i++) {
      html += `
        <div class="flex-between-center skeleton-row skeleton-base" style="padding: 0 10px;">
          <div class="skeleton-text" style="width: 40%; margin-bottom: 0;"></div>
          <div class="skeleton-text" style="width: 10%; margin-bottom: 0;"></div>
          <div class="skeleton-text" style="width: 10%; margin-bottom: 0;"></div>
          <div class="skeleton-text" style="width: 15%; margin-bottom: 0; border-radius: 20px;"></div>
        </div>
      `;
    }
    html += `
        </div>
      </div>
    `;
    return html;
  },

  /**
   * Gera o esqueleto genérico para o dashboard
   */
  getDashboard: (isTeacher = false) => {
    if (isTeacher) {
      return `
        <div class="flex-col gap-24">
          <div class="grid-3-cols gap-16">
            <div class="card skeleton-base" style="height: 100px;"></div>
            <div class="card skeleton-base" style="height: 100px;"></div>
            <div class="card skeleton-base" style="height: 100px;"></div>
          </div>
          ${Skeleton.getTableRows(4)}
        </div>
      `;
    } else {
      return `
        <div class="flex-col gap-24">
          <div class="grid-3-cols gap-16">
            <div class="card skeleton-base" style="height: 80px;"></div>
            <div class="card skeleton-base" style="height: 80px;"></div>
            <div class="card skeleton-base" style="height: 80px;"></div>
          </div>
          ${Skeleton.getGridCards(3)}
        </div>
      `;
    }
  }
};
