import {getUserFavourites} from "@/data/favourites";
import {getPropertiesByIDs} from "@/data/properties";
import PropertiesTable from "@/app/admin-dashboard/properties-table";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import PropertyStatusBadge from "@/components/property-status-badge";
import {Button} from "@/components/ui/button";
import {EyeIcon, Trash2Icon} from "lucide-react";
import Link from "next/link";
import RemoveFavouriteButton from "@/app/account/my-favourites/remove-favourite-button";
import {redirect} from "next/navigation";

export default async function MyFavourites({
    searchParams} : {
        searchParams: Promise<any>
    }
    ) {
    const searchParamsValues = await searchParams;
    const page = searchParamsValues?.page ? parseInt(searchParamsValues.page) : 1;
    const pageSize = 2;
    const favourites = await getUserFavourites();
    const allFavourites = Object.keys(favourites);
    const totalPages = Math.ceil(allFavourites.length / pageSize);

    const paginatedFavourites = allFavourites.slice((page - 1) * pageSize, page * pageSize);

    if(!paginatedFavourites.length && page > 1) {
        redirect(`/account/my-favourites?page=${totalPages}`);
    }

    const properties = await getPropertiesByIDs(paginatedFavourites)

    return (<div className={"max-w-screen-lg mx-auto"}>
            <h1 className={"py-4 mt-5 text-4xl font-bold"}>My Favourites</h1>
            {properties.length ? <>
                <Table className={"mt-4"}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                Property
                            </TableHead>
                            <TableHead>
                                Status
                            </TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedFavourites.map(favourite => {
                            const property = properties.find(p => p.id === favourite);
                            const address = [property?.address1, property?.address2, property?.city, property?.postcode]
                                .filter(Boolean).join(", ");
                        return <TableRow key={favourite}>
                            <TableCell>
                                {address}
                            </TableCell>
                            <TableCell>
                                {!!property && (
                                    <PropertyStatusBadge status={property.status} />
                                )}
                            </TableCell>
                            <TableCell className={"flex justify-end gap-1"}>
                                {!!property && (<>
                                        <Button asChild variant={"outline"}>
                                                    <Link href={`/property/${property.id}`}>
                                                        <EyeIcon />
                                                    </Link>
                                        </Button>
                                    <RemoveFavouriteButton propertyId={property.id ?? ""} />
                                </>)
                                }
                            </TableCell>
                        </TableRow>
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3} className={"text-center"}>
                                {Array.from({length: totalPages}).map((_, index) => (
                                    <Button disabled={page === index + 1} key={index} asChild={page !== index + 1} variant={"outline"} className={"mx-1"}>
                                        <Link href={`/account/my-favourites?page=${index + 1}`}>{`${index + 1}`}</Link>
                                    </Button>
                                ))}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </>
            : <h2 className={"text-center text-zinc-400 text-3xl font-bold py-10"}>You have no favourited properties.</h2>
        }
        </div>
    );
}