import {Cevap} from './cevap';
import {Observable} from 'rxjs';
import {Kullanici} from './kullanici';
import {Kategori} from './kategori';

export class Soru {
  id?: string;
  icerik: string;
  resim: string;
  kullaniciId: string;
  kategoriId: string;
  begeniSayisi?: number;

  cevaplar?: Cevap[] | Observable<Cevap[]>;
  uye?: Kullanici;
  kategori?: Kategori;
}
