import { BRAND } from "@/config/brand";


export default function Header() {

  return (
    <header>

      <div className="brand">
        {BRAND.name}
      </div>

      <h1>
        {BRAND.headline}
      </h1>

      <p>
        {BRAND.description}
      </p>

    </header>
  );

}