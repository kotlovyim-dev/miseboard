import Image from "next/image";

export function Engraving() {
  return (
    <figure>
      <div className="aspect-[4/3] overflow-hidden bg-highlighter p-4 md:aspect-auto md:p-10">
        <Image
          src="/landing/reform-club-kitchen.jpg"
          alt="A cross-section of the Reform Club kitchen in 1842: cooks at long tables, a central range, larders, and a plan with a legend beneath."
          width={1920}
          height={1056}
          unoptimized
          className="h-full w-full object-cover object-[50%_20%] mix-blend-multiply brightness-110 contrast-150 grayscale md:h-auto"
        />
      </div>
      <figcaption className="mt-4 max-w-[64ch] text-lg">
        The Kitchen Department of the Reform Club, a lithograph by John Tarring made for Alexis
        Soyer in 1842. Kitchens have always run on paper.
      </figcaption>
    </figure>
  );
}
