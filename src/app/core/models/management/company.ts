export class Company {
  public id: number;
  public name: string;
  public address: string;
  public tax: string;
  public email: string;
  public personContact: string;
  public tel: string;
  public mobile: string;
  public fax: string;
  public delegate: string;
  public bankAccount: string;
  public accountHolder: string;
  public bankName: string;

  constructor(companyForm: any) {
    this.name = companyForm.name || '';
    this.address = companyForm.address || '';
  }
}
