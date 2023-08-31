import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PillServices } from '../services/pills.services';
import { Pill } from '../entity/pill.entity';
import { Medicine } from 'src/modules/medicines/entity/medicine.entity';
import { addDays } from 'date-fns';
import { Repository } from 'typeorm';
import { AppError } from 'src/errors/app-error';

const pills = [
  new Pill({
    name: 'Paracetamol',
    isTaken: false,
    medicineId: 'fde49ff7-1ba3-4d18-ad40-3d21074b18a9',
    takePillDay: addDays(new Date(), 3),
    id: '3e572c76-b32b-4889-b5a9-96bed28f3ec6',
  }),
  new Pill({
    name: 'Paracetamol',
    isTaken: false,
    medicineId: 'fde49ff7-1ba3-4d18-ad40-3d21074b18a9',
    takePillDay: addDays(new Date(), 3),
    id: '3e572c76-b32b-4889-b5a9-96bed28f3ec6',
  }),
];

const medicines: Medicine[] = [
  new Medicine({
    name: 'Paracetamol',
    frequency: 5,
    until: addDays(new Date(), 2),
    userId: '',
    id: 'fde49ff7-1ba3-4d18-ad40-3d21074b18a9',
    createdAt: new Date(),
    pills: [
      new Pill({
        name: 'Paracetamol',
        isTaken: false,
        medicineId: 'fde49ff7-1ba3-4d18-ad40-3d21074b18a9',
        takePillDay: addDays(new Date(), 3),
        id: '3e572c76-b32b-4889-b5a9-96bed28f3ec6',
      }),
      new Pill({
        name: 'Paracetamol',
        isTaken: false,
        medicineId: 'fde49ff7-1ba3-4d18-ad40-3d21074b18a9',
        takePillDay: addDays(new Date(), 3),
        id: '3e572c76-b32b-4889-b5a9-96bed28f3ec6',
      }),
      ,
    ],
  }),
  new Medicine({
    name: 'Dipirona',
    frequency: 5,
    until: addDays(new Date(), 1),
    userId: '',
    id: 'fde49ff7-1ba3-4d18-ad40-3dasds21074b18a9',
    createdAt: new Date(),
    pills: [
      new Pill({
        name: 'Paracetamol',
        isTaken: false,
        medicineId: 'fde49ff7-1ba3-4d18-ad40-3d21074b18a9',
        takePillDay: addDays(new Date(), 3),
        id: '3e572c76-b32b-4889-b5a9-96bed28f3ec6',
      }),
      new Pill({
        name: 'Paracetamol',
        isTaken: false,
        medicineId: 'fde49ff7-1ba3-4d18-ad40-3d21074b18a9',
        takePillDay: addDays(new Date(), 3),
        id: '3e572c76-b32b-4889-b5a9-96bed28f3ec6',
      }),
    ],
  }),
];

describe('PillServices', () => {
  let pillServices: PillServices;
  let pillRepository: Repository<Pill>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PillServices,

        {
          provide: getRepositoryToken(Medicine),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn().mockResolvedValue(medicines),
          },
        },
        {
          provide: getRepositoryToken(Pill),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn().mockResolvedValue(pills),
            findOne: jest.fn().mockResolvedValue(pills[0]),
          },
        },
      ],
    }).compile();

    pillServices = module.get<PillServices>(PillServices);
    pillRepository = module.get<Repository<Pill>>(getRepositoryToken(Pill));
  });

  describe('getPillsByDay', () => {
    it('Should get the pills of the day correctly', async () => {
      const result = await pillServices.getPillsByDay({
        date: new Date(),
        userId: '',
      });

      expect(Array.isArray(result)).toBe(true);
      result.forEach((pill) => expect(pill).toBeInstanceOf(Pill));
      expect(result.length).toBe(4);
    });
  });

  describe('takePill', () => {
    it('Should return an pill with isTaken equals to true ', async () => {
      const result = await pillServices.takePill('');

      expect(result.statusCode).toBe(200);
    });

    it('Should return an status code of 404 a message saying that didnt found the pill', async () => {
      pillRepository.findOne = jest.fn().mockReturnValue(null);

      try {
        await pillServices.takePill('');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(404);
      }
    });
  });
});
