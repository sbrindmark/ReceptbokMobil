# Receptbok – Mobil

En mobilapp för receptboken, byggd med React Native och Expo. Hämtar samma data som webbappen från backend-API:t och visar recept i lista och detaljvy, med möjlighet att skapa, ändra och ta bort.

Backend-repo: https://github.com/sbrindmark/ReceptbokBackend

## Teknik
- React Native + Expo
- Node.js
- Backend måste vara igång (se backend-repot). Appen hittar datorns IP automatiskt, men telefonen och datorn måste vara på **samma nätverk**.

## Kom igång
```bash
git clone https://github.com/sbrindmark/ReceptbokMobile.git
cd ReceptbokMobile
npm install
npx expo start
```
Starta **backend först** (se backend-repot). Skanna sedan QR-koden med **Expo Go** på din telefon, eller tryck `i` (iOS-simulator) / `a` (Android-emulator).

## Funktioner
- Lista recept i ett rutnät (två per rad)
- Detaljvy för ett enskilt recept
- Skapa, ändra och ta bort recept via API:et
- Laddningsindikator, pull-to-refresh och tomt-läge
- Felmeddelande visas om ett API-anrop misslyckas

## Tekniska val
- **Expo Router (fil-baserad routing):** skärmarna ligger i `app/`-mappen och routas automatiskt utifrån filstrukturen, i stället för att registreras manuellt med React Navigation – mindre kod och tydligare struktur.
- **Central `api.js`:** all backend-kommunikation ligger på ett ställe. Adressen till datorn hämtas automatiskt via `expo-constants` (`hostUri`), så appen fungerar på valfritt nätverk utan hårdkodad IP.
- **`useRecipes`-hook:** listskärmens data och logik ligger i en egen hook, skild från UI:t (separation of concerns).
- **Delad `RecipeForm`:** samma formulärkomponent återanvänds för både skapa och ändra.
- **Samma backend som webben:** mobil och webb delar API och data – bara gränssnittslagret skiljer sig.
