export class Company {
  public id: number;
  public cityId?: number;
  public insurranceManagementId?: number;
  public code: string;
  public salaryAreaId?: number;
  public name: string;
  public addressRegister: string;
  public address: string;
  public taxCode: string;
  public delegate: string;
  public traders: string;
  public mobile: string;
  public emailOfContract: string;
  public paymentMethodId?: number;
  public responseResults: string;
  public groupCompanyCode: string
  public submissionType?: number;
  public districtId?: number;
  public wardsId?: number;
  public object?: number;  
  public bankAccount: string;
  public accountHolder: string;
  public bankName: string;

  constructor(companyForm: any) {
    this.name = companyForm.name || '';
    this.address = companyForm.address || '';
    this.id = companyForm.id || 0;
    this.cityId = companyForm.cityId|| null;
    this.insurranceManagementId = companyForm.insurranceManagementId || null;
    this.code = companyForm.code || '';
    this.salaryAreaId = companyForm.salaryAreaId || null;
    this.name = companyForm.name || '';
    this.addressRegister = companyForm.addressRegister || null;
    this.address = companyForm.address || '';
    this.taxCode = companyForm.taxCode || '';
    this.delegate = companyForm.delegate || '';
    this.traders = companyForm.traders || '';
    this.mobile = companyForm.mobile || '';
    this.emailOfContract = companyForm.emailOfContract ||'';
    this.paymentMethodId = companyForm.paymentMethodId || null;
    this.responseResults = companyForm.responseResults || '';
    this.groupCompanyCode = companyForm.groupCompanyCode || '';
    this.submissionType = companyForm.submissionType || null;
    this.districtId = companyForm.districtId || null;
    this.wardsId = companyForm.wardsId || null;
    this.object = companyForm.object || null;
  }
}
