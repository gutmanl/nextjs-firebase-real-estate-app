import {getPropertyByID} from "@/data/properties";
import {Breadcrumbs} from "@/components/ui/breadcrumb";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import EditPropertyForm from "@/app/admin-dashboard/edit/[propertyId]/edit-property-form";

export default async function EditProperty({params} : {
    params: Promise<any>;
}) {
    const paramsValue = await params;
    //Removing created and updated timestamps from the passed-down property object due to issues
    //with passing these things from server to client components
    const {created, updated, ...property} = await getPropertyByID(paramsValue.propertyId);

    return (
        <div>
            <Breadcrumbs items={[{
                href: "/admin-dashboard",
                label: "Dashboard"
            }, {
                label: "Edit Property"
            }]} />
            <Card className="mt-5">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        Edit Property
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <EditPropertyForm {...property} />
                </CardContent>
            </Card>
        </div>

    )
}