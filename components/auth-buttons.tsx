"use client"

import { useAuth } from "@/context/auth";
import Link from "next/link";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {useRouter} from "next/navigation";

export default function AuthButtons() {
    const router = useRouter();
    const auth = useAuth();

    return (
        <div>
            {!!auth?.currentUser &&
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                      {!!auth.currentUser.photoURL && (
                    <Image 
                      src={auth.currentUser.photoURL} 
                      alt={auth.currentUser.displayName + ' avatar'}
                      width={70}
                      height={70}
                      className="object-cover"
                    />
                          )
                      }
                    <AvatarFallback className={"text-sky-950"}>
                        {(auth.currentUser.displayName || auth.currentUser.email )?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <div>{auth.currentUser.displayName}</div>
                    <div className="font-normal text-xs">{auth.currentUser.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      My Account
                    </Link>
                  </DropdownMenuItem>
                    {!!auth.customClaims?.admin && (
                        <DropdownMenuItem asChild>
                            <Link href="/admin-dashboard">
                                Admin Dashboard
                            </Link>
                        </DropdownMenuItem>
                    )}
                    {!auth.customClaims?.admin && (
                        <DropdownMenuItem asChild>
                            <Link href="/account/my-favourites">
                                My Favourites
                            </Link>
                        </DropdownMenuItem>
                    )}
                  <DropdownMenuItem onClick={async () => {
                      await auth.logout();
                      router.refresh();
                  }}>Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            }
            {
                !auth?.currentUser &&
                <>
                  <div className="flex gap-2 items-center">
                    <Link href="/login" className="uppercase tracking-widest hover:underline">Log In</Link>
                    <div className="h-8 w-px bg-white/50"></div>
                    <Link href="/register" className="uppercase tracking-widest hover:underline">Sign Up</Link>
                  </div>
                </>
            }
        </div>
    );
}
