export declare const mockData: ({
    arn: string;
    assetTemplateId: string;
    creationDate: string;
    description: string;
    id: string;
    lastUpdateDate: string;
    name: string;
    assetProperties: ({
        id: string;
        name: string;
        alias: null;
        dataType: null;
        unit: null;
        value: number;
    } | {
        id: string;
        name: string;
        alias: null;
        dataType: null;
        unit: null;
        value: string;
    })[];
    references: never[];
    status: {
        state: string;
    };
} | {
    arn: string;
    assetTemplateId: string;
    creationDate: string;
    description: string;
    id: string;
    lastUpdateDate: string;
    name: string;
    assetProperties: {
        id: string;
        name: string;
        alias: null;
        dataType: null;
        unit: null;
        value: number;
    }[];
    references: {
        id: string;
        name: string;
        size: number;
        type: {
            name: string;
            templateId: string;
        };
    }[];
    status: {
        state: string;
    };
})[];
export declare const mockNonActiveData: ({
    arn: string;
    assetTemplateId: string;
    creationDate: string;
    description: string;
    id: string;
    lastUpdateDate: string;
    name: string;
    assetProperties: ({
        id: string;
        name: string;
        alias: null;
        dataType: null;
        unit: null;
        value: number;
    } | {
        id: string;
        name: string;
        alias: null;
        dataType: null;
        unit: null;
        value: string;
    })[];
    references: never[];
    assetStatus: {
        state: string;
    };
    status?: undefined;
} | {
    arn: string;
    assetTemplateId: string;
    creationDate: string;
    description: string;
    id: string;
    lastUpdateDate: string;
    name: string;
    assetProperties: {
        id: string;
        name: string;
        alias: null;
        dataType: null;
        unit: null;
        value: number;
    }[];
    references: {
        id: string;
        name: string;
        size: number;
        type: {
            name: string;
            templateId: string;
        };
    }[];
    status: {
        state: string;
    };
    assetStatus?: undefined;
})[];
