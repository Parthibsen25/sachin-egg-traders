# 🔐 Admin Panel Guide

## How to Access Admin Panel

1. Open: **`https://yourdomain.com/admin.html`** (or locally: `file:///Users/parthibsen/Downloads/egg/admin.html`)
2. Enter Password: **`sachin123`** ⬅️ **IMPORTANT: Change this password!**
3. You'll see the price update form

## How to Update Prices

1. **Fill in the prices (per peti)** for each egg type:
   - Big Egg (₹1100)
   - Medium Egg (₹1000)
   - Small Egg (₹900)
   - Desi Egg (₹1200)
   - Duck Egg (₹1500)

   **Note: 1 Peti = 210 Pieces**

2. **Update the date** (e.g., "May 11, 2026")
3. Click **"💾 Save Prices"** — Updates will appear on website within 30 seconds
5. Click **"💾 Save Prices"** — Updates will appear on website within 30 seconds

## Where Data is Stored

✅ **Prices are saved in your browser's local storage** - They persist even after closing the page
✅ **No backend server needed** - Works on any computer that opens the admin page
✅ **Updates appear automatically** on the main website within 30 seconds

## Google Sheets (Cross-device) — Optional

If you want prices to update across devices automatically, publish a Google Sheet and point the site to the published CSV.

Steps:
1. Create a Google Sheet with columns: `type,price,updateDate` (header row).
   - Use `type` values: `big`, `medium`, `small`, `desi`, `duck`.
2. Fill rows with your values, e.g.:
   ```csv
   type,price,updateDate
   big,1100,May 10, 2026
   medium,1000,May 10, 2026
   small,900,May 10, 2026
   desi,1200,May 10, 2026
   duck,1500,May 10, 2026
   ```
3. In Google Sheets: `File` → `Share` → `Publish to web` → choose `Comma-separated values (.csv)` and publish the sheet.
4. Copy the published CSV URL.
5. Open `prices.js` and set `SHEET_CSV_URL` to that URL (paste between the quotes).

Behavior:
- When `SHEET_CSV_URL` is set, the website will attempt to fetch prices from the sheet first.
- If the sheet is unavailable, it falls back to `localStorage` or defaults.
- This is a one-way sync (Sheet → Website). To update sheet, edit the Google Sheet directly.

Security note: Published CSV is public — do not include sensitive info.

## How to Change the Password

**IMPORTANT:** Change the default password immediately!

1. Open `admin.html` in a text editor
2. Find line: `const ADMIN_PASSWORD = "sachin123";`
3. Replace `"sachin123"` with your own password, e.g., `"mySecretPassword123"`
4. Save the file
5. Upload to GitHub: 
   ```bash
   git add admin.html
   git commit -m "Update admin password"
   git push
   ```

## How It Works

1. **Admin Panel** (`admin.html`) - You update prices here
2. **Browser Storage** - Prices saved locally using `localStorage`
3. **Main Website** (`sachin_egg_traders.html`) - Reads from storage and displays prices
4. **Automatic Sync** - Website checks for updated prices every 30 seconds

## Technical Details

- **No Database**: All data stored in browser cache
- **No Backend API**: Everything client-side
- **Persistent**: Prices survive browser restart (same computer)
- **Device-Specific**: Each device has its own stored prices
- **Password**: Simple client-side check (for privacy, not security)

## Troubleshooting

**Q: Prices not updating?**
- Make sure you're on the same browser/computer where you saved them
- Try refreshing the website
- Check browser console for errors (F12 → Console)

**Q: Passwords not working?**
- Check if you changed the password correctly in `admin.html`
- Remember: Password is case-sensitive
- Try opening admin page in incognito window (clears session)

**Q: Lost my prices?**
- Prices are only saved on the device where you updated them
- Open admin panel on the same device/browser
- If you cleared browser cache, prices are gone (but defaults will load)

---

**Admin Password:** `sachin123` → Change this immediately!
