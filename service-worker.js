const CACHE_NAME = 'cocota-bet-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.tsx',
  '/contexts/BalanceContext.tsx',
  '/contexts/BetContext.tsx',
  '/components/AuthScreen.tsx',
  '/components/HomeScreen.tsx',
  '/components/SportsScreen.tsx',
  '/components/CasinoScreen.tsx',
  '/components/MyBetsScreen.tsx',
  '/components/Header.tsx',
  '/components/BottomNav.tsx',
  '/components/BetSlip.tsx',
  '/components/games/CornSlotGame.tsx',
  '/components/games/FarmRouletteGame.tsx',
  '/components/games/HighCardPokerGame.tsx',
  '/components/games/ChickenBingoGame.tsx',
  '/components/games/BlackjackGame.tsx',
  '/components/games/ClassroomScoldingGame.tsx',
  '/components/games/WhereIsCocotaGame.tsx',
  '/components/games/CocotaFlightGame.tsx',
  '/components/games/MysteryBackpackGame.tsx',
  '/components/games/RubberEraserWarGame.tsx',
  '/components/games/FinalGradeGame.tsx',
  '/components/games/DueDateGame.tsx',
  '/components/games/CocotaFortuneGame.tsx',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
