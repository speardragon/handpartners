export default function Footer() {
  return (
    <footer className="bg-background text-muted-foreground border-t px-6 py-6 text-center text-xs">
      <p>© {new Date().getFullYear()} 핸드파트너스. All rights reserved.</p>
    </footer>
  );
}
