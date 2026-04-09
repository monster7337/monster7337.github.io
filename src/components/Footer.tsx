export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="container-x py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-extrabold">В Ёлках</div>
          <div className="text-sm muted">Антикафе с белками и минипигами</div>
        </div>
        <div className="text-sm muted">© {new Date().getFullYear()} Все права защищены</div>
      </div>
    </footer>
  );
}
