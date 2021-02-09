import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../servisler/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-profilim-sayfa',
  templateUrl: './profilim-sayfa.component.html',
  styleUrls: ['./profilim-sayfa.component.css']
})
export class ProfilimSayfaComponent implements OnInit {
  ad: string = '';
  soyad: string = '';
  email: string = '';

  suankiSifre: string = "";
  yeniSifre: string = "";

  constructor(public authServis: AuthService, public router: Router, public toastr: ToastrService) {
  }

  ngOnInit(): void {
    const isimDizi = this.authServis.kullanici.displayName.split(' ');
    this.ad = isimDizi.slice(0, isimDizi.length - 1).join(' ');
    this.soyad = isimDizi[isimDizi.length - 1];
    this.email = this.authServis.kullanici.email;
  }

  Kaydet() {
    if (!this.ad || !this.soyad || !this.email) return this.toastr.error("Alanları Doldurunuz")

    this.authServis.kullanici.updateProfile({displayName: this.ad + " " + this.soyad})
  }

  SifreDegistir() {
    if (!this.yeniSifre || !this.suankiSifre) return this.toastr.error("Alanları Doldurunuz")

    this.authServis.GirisYap(this.authServis.kullanici.email, this.suankiSifre).then(() => {
      return this.authServis.kullanici.updatePassword(this.yeniSifre)
    })
  }

  EpostaDegistir() {
    if (!this.email) return this.toastr.error("Alanları Doldurunuz")

    return this.authServis.kullanici.updateEmail(this.email)
  }
}
