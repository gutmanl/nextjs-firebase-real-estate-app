import {getPropertyByID} from "@/data/properties";
import Markdown from "react-markdown";
import {Button} from "@/components/ui/button";
import {ArrowLeftIcon, BathIcon, BedIcon} from "lucide-react";
import PropertyStatusBadge from "@/components/property-status-badge";
import numeral from "numeral";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import Image from "next/image";
import BackButton from "@/app/property/[propertyId]/back-button";

export default async function Property({params}:{params: Promise<any>}) {
    const paramsValue = await params;
    const property = await getPropertyByID(paramsValue.propertyId);

    const addressLines = [property.address1, property.address2, property.postcode]
        .filter(line => !!line);

    return <div className="grid grid-cols-[1fr_500px]">
        <div>
            {
                !!property.images &&
                <Carousel className={"w-full"}>
                    <CarouselContent>
                        {property.images.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className={"relative h-[80vh] min-h-80"}>
                                    <Image src={`https://firebasestorage.googleapis.com/v0/b/nextjs-15-and-firebase-6d96e.firebasestorage.app/o/${
                                        encodeURIComponent(image)}?alt=media`} alt={`image ${index + 1}`} fill className={"object-cover"}/>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {property.images.length > 1 && <>
                        <CarouselPrevious className={"translate-x-24 size-12"} />
                        <CarouselNext className={"-translate-x-24 size-12"} />
                    </>
                    }
                </Carousel>
            }
            {/* The initial solution from the course (className for the MD component) no longer works. It would make little
             sense anyway since Markdown doesn't provide a wrapper tag, it just applies
             the markup and disappears*/}
            <div className="property-description max-w-screen-md mx-auto py-10 px-4">
                <BackButton />
                <Markdown>
                    { property.description}
                </Markdown>
            </div>

        </div>
        <div className={"bg-sky-200 h-screen p-10 sticky top-0 grid place-items-center"}>
            <div className={"flex flex-col gap-10 w-full"}>
                <PropertyStatusBadge className={"mr-auto text-base"} status={property.status} />
                <h1 className="text-4xl font-semibold">
                    {addressLines.map((line: string | undefined, index: number) => (
                        <div key={index}>
                            {line}
                            {index < addressLines.length - 1 && ", "}
                        </div>
                    ))}
                </h1>
                <h2 className="text-3xl font-light">
                    {numeral(property.price).format("0,0")} €
                </h2>
                <div className="flex gap-10">
                    <div className={"flex gap-2"}>
                        <BedIcon /> {property.bedrooms} Bedrooms
                        <BathIcon /> {property.bathrooms} Bathrooms
                    </div>
                </div>
            </div>
        </div>
    </div>
}