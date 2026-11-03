import Image from "next/image";

export function OrderPhoto() {
  return (
    <figure className="max-w-lg">
      <div className="aspect-[122/100] overflow-hidden">
        <Image
          src="/landing/waiter-1906.jpg"
          alt="A waiter in a bow tie writes down an order from two men seated at a round table in a bay-windowed dining room."
          width={1920}
          height={1507}
          unoptimized
          className="-mt-[3.6%] -ml-[4.5%] h-auto w-[113.6%] max-w-none grayscale"
        />
      </div>
      <figcaption className="mt-3 text-lg">A waiter writes down the order, 1906.</figcaption>
    </figure>
  );
}
