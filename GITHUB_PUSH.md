# Push Top9jaVintage to GitHub

This workspace cannot push to GitHub directly (no GitHub connector, `gh` CLI, or configured remote). The work is committed locally and packaged as `top9javintage.bundle`.

## Option A — clone from the bundle (recommended)

```bash
git clone top9javintage.bundle top9javintage
cd top9javintage
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

## Option B — push from this folder on your machine

Copy the `top9javintage` folder to your machine, then:

```bash
cd top9javintage
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

## Continuous updates

After each build milestone:

```bash
git add -A
git commit -m "Describe the milestone"
git push
```

The included GitHub Actions workflow (`.github/workflows/ci.yml`) runs typecheck, production build, and Playwright tests on every push/PR to `main`.

Do not commit `.env.local`, payment keys, or real customer data. Use `.env.example` as the template.
