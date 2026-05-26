import { Component, computed, input, output } from '@angular/core';
import { AddressType, IAddressModel } from '@features/person/interfaces/address.model';
import { SHOW_ALWAYS } from '@shared/components/table/constants/table-constants';
import { ITableConfig } from '@shared/components/table/interfaces/table-config';
import { Table } from '@shared/components/table/table';
import { IMAGES } from '@shared/constants/images';

@Component({
    selector: 'app-address-list',
    imports: [Table],
    templateUrl: './address-list.html',
    styleUrl: './address-list.scss',
})
export class AddressList {
    addresses = input.required<IAddressModel[]>();

    onNew = output<void>();

    tableConfig = computed<ITableConfig<IAddressModel>>(() => ({
        hasHover: true,
        data: this.addresses(),
        titles: [
            {
                name: 'Tipo',
                dataField: 'type',
                image: (data) => this.addressTypeIcon(data.type),
            },
            {
                name: 'CEP',
                dataField: 'zipCode',
            },
            {
                name: 'Logradouro',
                dataField: 'street',
                transform: (data) => `${data.street}, ${data.number}`,
            },
            {
                name: 'Bairro',
                dataField: 'neighborhood',
            },
            {
                name: 'Cidade',
                dataField: 'city',
            },
            {
                name: 'UF',
                dataField: 'state',
            },
        ],
        buttons: [
            {
                icon: IMAGES.EDIT,
                show: SHOW_ALWAYS,
                name: '',
                action: (dataModel) => {},
            },
            {
                icon: IMAGES.REMOVE,
                show: SHOW_ALWAYS,
                name: '',
                action: (dataModel) => {},
            },
        ],
    }));

    addressTypeIcon(addressType: AddressType): string {
        let image = '';
        switch (addressType) {
            case 'C':
                image = IMAGES.BILLING_ADDRESS;
                break;
            case 'M':
                image = IMAGES.RESIDENTIAL_ADDRESS;
                break;
            default:
                image = IMAGES.DELIVERY_ADDRESS;
                break;
        }

        return image;
    }

    get buttonAddTitle(): string {
        return 'Adicionar Endereço';
    }

    get buttonAddIcon(): string {
        return IMAGES.NEW;
    }
}
