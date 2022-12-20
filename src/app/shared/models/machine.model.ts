export class Machine {
  _id!: string;
  name!: string;
  category!: string;
  description!: string;
  materials!: MaterialList[];
}

export class MaterialList {
  _id!: string;
  material!: Material[];
}

export class Material {
  _id!: string;
  materialName!: string;
}
