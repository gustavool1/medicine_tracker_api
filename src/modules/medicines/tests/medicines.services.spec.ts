import { Test, TestingModule } from '@nestjs/testing';
import { MedicinesServices } from '../services/medicines.services';
import { Medicine } from '../entity/medicine.entity';
import { Pill } from '../entity/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { addDays } from 'date-fns';

const createMedicinePayload = {
  name: 'Paracetamol',
  frequency: 5,
  until: addDays(new Date(), 3),
  userId: '',
};

const medicine: Medicine = new Medicine({
  name: 'Paracetamol',
  frequency: 5,
  until: addDays(new Date(), 3),
  userId: '53357394-a478-4b74-9daa-429527ba404f',
  id: 'fde49ff7-1ba3-4d18-ad40-3d21074b18a9',
  createdAt: new Date(),
  pills: [],
});

const pill: Pill = new Pill({
  name: 'Paracetamol',
  isTaken: false,
  medicineId: 'fde49ff7-1ba3-4d18-ad40-3d21074b18a9',
  takePillDay: addDays(new Date(), 3),
  id: '3e572c76-b32b-4889-b5a9-96bed28f3ec6',
});

describe('MedicinesServices', () => {
  let medicinesServices: MedicinesServices;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicinesServices,
        {
          provide: getRepositoryToken(Medicine),
          useValue: {
            find: jest.fn(),
            create: jest.fn().mockResolvedValue(medicine),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Pill),
          useValue: {
            create: jest.fn().mockResolvedValue(pill),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    medicinesServices = module.get<MedicinesServices>(MedicinesServices);
  });

  describe('createMedicine', () => {
    it('Should create Medicine and its Pills', async () => {
      const result = await medicinesServices.createMedicine(
        createMedicinePayload,
      );

      expect(result).toBeInstanceOf(Medicine);
      expect(result.pills.length).toBe(3);
    });
  });
});
