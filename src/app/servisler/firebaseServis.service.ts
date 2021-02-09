import {Injectable, OnInit} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Soru} from '../modeller/soru';
import {Kategori} from '../modeller/kategori';
import {map} from 'rxjs/operators';
import {Cevap} from '../modeller/cevap';
import {Kullanici} from '../modeller/kullanici';
import {Begeni} from '../modeller/begeni';
import {AngularFireStorage} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServisService implements OnInit {

  constructor(public db: AngularFireDatabase, public storage: AngularFireStorage) {
  }

  ngOnInit() {

  }

  SoruListele() {
    return this.db.list<Soru>('soru').snapshotChanges().pipe(
      map(
        changes => {
          return changes.map(c => {
            const soru: Soru = {id: c.key, ...c.payload.val()};

            this.db.list<Cevap>('cevap', ref => ref.orderByChild('soruId').equalTo(soru.id).limitToFirst(5))
              .snapshotChanges()
              .subscribe(cevapChanges => {
                soru.cevaplar = cevapChanges.map(cevapC => {

                  const cevap: Partial<Cevap> = {
                    id: cevapC.key,
                    ...cevapC.payload.val()
                  };

                  this.db.list<Kullanici>('uye', ref => ref.orderByChild('kullaniciId').equalTo(cevapC.payload.val().kullaniciId))
                    .snapshotChanges()
                    .subscribe(uyeChanges => {
                      cevap.uye = {id: uyeChanges[0].key, ...uyeChanges[0].payload.val()};
                    });

                  return cevap as Cevap;
                });
              });

            this.db.list<Begeni>('begeni', ref => ref.orderByChild('soruId').equalTo(soru.id))
              .snapshotChanges()
              .subscribe(cevapChanges => {
                soru.begeniSayisi = cevapChanges.length;
              });

            this.db.list<Kullanici>('uye', ref => ref.orderByChild('kullaniciId').equalTo(soru.kullaniciId))
              .snapshotChanges()
              .subscribe(uyeChanges => {
                soru.uye = {
                  id: uyeChanges[0].key,
                  ...uyeChanges[0].payload.val()
                };
              });

            this.db.list<Kategori>('kategori', ref => ref.orderByKey().equalTo(soru.kategoriId))
              .snapshotChanges()
              .subscribe(kategoriChanges => {
                soru.kategori = {
                  id: kategoriChanges[0].key,
                  ...kategoriChanges[0].payload.val()
                };
              });

            return soru;
          });
        }
      )
    );
  }

  SorularimiListele(kullaniciId: string) {
    return this.db.list<Soru>('soru', ref => ref.orderByChild('kullaniciId').equalTo(kullaniciId)).snapshotChanges().pipe(
      map(
        changes => {
          return changes.map(c => {
            const soru: Soru = {...c.payload.val(), id: c.key,};

            this.db.list<Cevap>('cevap', ref => ref.orderByChild('soruId').equalTo(soru.id).limitToFirst(5))
              .snapshotChanges()
              .subscribe(cevapChanges => {
                soru.cevaplar = cevapChanges.map(cevapC => {
                  const cevap: Partial<Cevap> = {...cevapC.payload.val(), id: cevapC.key,};

                  this.db.list<Kullanici>('uye', ref => ref.orderByChild('kullaniciId').equalTo(cevapC.payload.val().kullaniciId))
                    .snapshotChanges()
                    .subscribe(uyeChanges => {
                      cevap.uye = {id: uyeChanges[0].key, ...uyeChanges[0].payload.val()};
                    });

                  return cevap as Cevap;
                });
              });

            this.db.list<Kullanici>('uye', ref => ref.orderByChild('kullaniciId').equalTo(soru.kullaniciId))
              .snapshotChanges()
              .subscribe(uyeChanges => {
                soru.uye = {
                  id: uyeChanges[0].key,
                  ...uyeChanges[0].payload.val()
                };
              });

            return soru;
          });
        }
      )
    );
  }

  SoruGetir(id: string) {
    const soruRef = this.db.object<Soru>('soru/' + id);
    return soruRef.snapshotChanges().pipe(
      map(
        change => {
          const soru: Soru = {id: change.key, ...change.payload.val()};

          this.db.list<Cevap>('cevap', ref => ref.orderByChild('soruId').equalTo(soru.id))
            .snapshotChanges()
            .subscribe(cevapChanges => {
              soru.cevaplar = cevapChanges.map(cevapC => {
                return {id: cevapC.key, ...cevapC.payload.val()};
              });
            });

          return soru;
        }
      )
    );
  }

  SoruGuncelle(id: string, icerik: string, kategoriId: string) {
    const soruRef = this.db.object<Soru>('soru/' + id);
    return soruRef.update({icerik: icerik, kategoriId: kategoriId});
  }

  SoruOlustur(icerik: string, kullaniciId: string, kategoriId: string, resim: File) {
    const dosyaYolu = kullaniciId + '-' + new Date(Date.now()).toString();
    const ref = this.storage.ref(dosyaYolu);
    ref.put(resim).then(
      () => {
        this.db.list<Soru>('soru').push({
          icerik: icerik,
          kullaniciId: kullaniciId,
          kategoriId: kategoriId,
          resim: dosyaYolu
        });
      }
    );
  }

  SoruSil(id: string) {
    this.db.list<Soru>('soru').remove(id).then(() => {
      return this.db.list<Cevap>('cevap', ref => ref.orderByChild('soruId').equalTo(id))
        .snapshotChanges()
        .subscribe(changes => {
          changes.forEach(c => {
            return this.db.object<Cevap>('cevap/' + c.key).remove();
          });
        });
    });
  }

  // Cevap

  CevapOlustur(icerik: string, kullaniciId: string, soruId: string) {
    return this.db.list<Cevap>('cevap').push({
      icerik: icerik,
      kullaniciId: kullaniciId,
      soruId: soruId
    });
  }

  CevapSil(id: string) {
    return this.db.object<Cevap>('cevap/' + id).remove();
  }

  // Beğeni
  BegeniOlustur(kullaniciId: string, soruId: string) {
    return this.db.list<Begeni>('begeni').push({
      kullaniciId: kullaniciId,
      soruId: soruId
    });
  }

  // Kategori

  KategoriListele() {
    return this.db.list<Kategori>('kategori').snapshotChanges();
  }

  KategoriOlustur(kategori: string) {
    return this.db.list<Kategori>('kategori').push({adi: kategori});
  }

  KategoriSil(id: string) {
    return this.db.object<Kategori>('kategori/' + id).remove();
  }

  KategoriGuncelle(id: string, kategori: string) {
    return this.db.object<Kategori>('kategori/' + id).update({
      adi: kategori
    });
  }


}
