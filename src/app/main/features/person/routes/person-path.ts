export const makePath = (isNaturalPerson: boolean, id: string | null = null) => {
    const path = ['person', 'form'];

    if (isNaturalPerson) {
        path.push('naturalPerson');
    } else {
        path.push('legalEntities');
    }

    if (id != null) {
        path.push(id);
    }

    return path;
};
