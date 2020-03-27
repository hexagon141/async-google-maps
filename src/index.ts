type Libraries = 'drawing' | 'geometry' | 'places' | 'visualization';
type Config = {
  key: string,
  libraries?: Array<Libraries>
}

function compileUrl({key, libraries, callback}: Config & {callback: string}) {
  const baseUrl = 'https://maps.googleapis.com/maps/api/js';
  const params = new URLSearchParams();

  params.append('key', key);
  params.append('callback', callback);

  if (Array.isArray(libraries) && libraries.length) {
    params.append('libraries', libraries.join(','));
  }

  return `${baseUrl}?${params}`;
}

export async function initGoogleMaps({key, libraries}: Config): Promise<typeof google.maps> {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
    }

    const callback = `__${Date.now().toString(32)}__`;

    (window as any)[callback] = () => resolve(window.google.maps);

    const api = document.createElement('script');

    api.src = compileUrl({
      key,
      libraries,
      callback,
    });

    api.onerror = () => reject({
      error: `${api.src} is not accessible`,
    });

    document.body.appendChild(api);
  })
}