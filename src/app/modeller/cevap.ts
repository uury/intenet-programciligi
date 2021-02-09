import {Kullanici} from './kullanici';

export class Cevap {
  id?: string;
  icerik: string;
  soruId: string;
  kullaniciId: string

  uye?: Kullanici;
}
