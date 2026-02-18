export default function Footer() {
  return (
    <footer className="border-t bg-background px-6 py-6 text-center text-xs text-muted-foreground">
      <p>© {new Date().getFullYear()} 핸드파트너스. All rights reserved.</p>
    </footer>
  );
}
