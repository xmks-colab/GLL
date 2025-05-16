function extrairTituloDeLink(link) {
  let title = '';

  try {
    const url = new URL(link);
    const pathSegments = url.pathname.split('/').filter(segment => segment);

    // Padrões conhecidos
    if (url.hostname.includes('novelmania')) {
      // Para links do novelmania
      if (pathSegments.includes('novels')) {
        const novelIndex = pathSegments.indexOf('novels');
        if (pathSegments[novelIndex + 1]) {
          title = pathSegments[novelIndex + 1];
        }
      }
    } else if (url.hostname.includes('animeshentai')) {
      // Para links do animeshentai
      if (pathSegments.includes('hentai')) {
        const hentaiIndex = pathSegments.indexOf('hentai');
        if (pathSegments[hentaiIndex + 1]) {
          title = pathSegments[hentaiIndex + 1];
        }
      }
    } else if (url.hostname.includes('anitube')) {
      // Para links do anitube
      if (pathSegments.includes('anime')) {
        const animeIndex = pathSegments.indexOf('anime');
        if (pathSegments[animeIndex + 1]) {
          title = pathSegments[animeIndex + 1];
        }
      }
    } else if (url.hostname.includes('imperiodabritannia')) {
      // Para links do Imperio da Britannia
      if (pathSegments.includes('manga')) {
        const mangaIndex = pathSegments.indexOf('manga');
        if (pathSegments[mangaIndex + 1]) {
          title = pathSegments[mangaIndex + 1];
        }
      }
    } else if (url.hostname.includes('animefire')) {
      // Para links do AnimeFire
      if (pathSegments.includes('animes')) {
        const animeIndex = pathSegments.indexOf('animes');
        if (pathSegments[animeIndex + 1]) {
          title = pathSegments[animeIndex + 1];
          // Remove sufixos comuns
          title = title
            .replace(/-todos-os-episodios$/, '')
            .replace(/-episodio-\d+$/, '')
            .replace(/-todos-episodios$/, '');
        }
      }
    }

    // Limpa e formata o título
    title = title
      .replace(/-/g, ' ') // Substitui hífens por espaços
      .replace(/\b\w/g, l => l.toUpperCase()) // Capitaliza primeira letra de cada palavra
      .replace(/Cap \d+/i, '') // Remove referências a capítulos
      .replace(/#.*$/, '') // Remove tudo após #
      .replace(/\d+$/, '') // Remove números no final
      .replace(/\s+/g, ' ') // Remove espaços múltiplos
      .trim(); // Remove espaços extras

    return title || null; // Retorna null caso não encontre título
  } catch (error) {
    console.error('Erro ao processar o link:', error);
    return null; // Retorna null para links inválidos
  }
}