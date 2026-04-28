export interface INavbarItem {
    name: string;
    route: string;
    children: INavbarItem[];
    external?: boolean;
}
