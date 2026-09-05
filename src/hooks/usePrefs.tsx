@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #faf8f2;
  --fg: #0b1410;
  --card: #ffffff;
  --muted: #5c6b62;
  --border: #e5dfd0;
  --accent: #0a5c45;
  --gold: #c9a227;
}

.dark {
  --bg: #0b1410;
  --fg: #f5f0e6;
  --card: #12201a;
  --muted: #9aada2;
  --border: #243d32;
  --accent: #10b981;
  --gold: #e8d48b;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--bg);
  color: var(--fg);
  min-height: 100dvh;
}

@layer components {
  .card-lux {
    @apply rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lux backdrop-blur-sm;
  }

  .gold-line {
    @apply h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent;
  }

  .ornament {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a227' fill-opacity='0.06'%3E%3Cpath d='M30 0l4 26L60 30l-26 4L30 60l-4-26L0 30l26-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
}

/* Subtle scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-thumb {
  background: #c9a22766;
  border-radius: 4px;
}
