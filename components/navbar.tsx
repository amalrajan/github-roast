import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import NextLink from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* Title on the top left */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li">
          <NextLink className="flex items-center gap-1" href="/">
            <p className="font-bold text-inherit">GitHub Roast</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      {/* GitHub link and theme switch on the right */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
        <NavbarItem>
          <Link
            isExternal
            aria-label="Github"
            href="https://www.github.com/amalrajan/github-roast"
          >
            <GithubIcon className="text-default-500" />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
