import { Component, computed, input, output } from '@angular/core';
import { ADDRESS_TYPE_LABEL, AddressType, IAddressModel } from '@features/person/interfaces/address.model';
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
                transform: (data) => ADDRESS_TYPE_LABEL[data.type as AddressType] ?? data.type,
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
        buttons: [],
    }));

    get buttonAddTitle(): string {
        return 'Adicionar Endereço';
    }

    get buttonAddIcon(): string {
        return IMAGES.NEW;
    }
}
