export const makePath = (isNaturalPerson: boolean, redirectTo: 'list' | 'form' = 'form', id: string | null = null) => {
    const path = ['person', redirectTo];

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
