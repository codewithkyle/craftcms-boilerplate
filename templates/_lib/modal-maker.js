var h=()=>{};var e=class extends HTMLElement{constructor(t=h){super();this.close=()=>{this.reject(),this.remove();};this.reject=t;}connected(){}connectedCallback(){this.closeButton=this.querySelector(".close"),this.closeButton.addEventListener("click",this.close),document.activeElement.blur(),this.closeButton.focus(),this.backdrop=this.querySelector(".backdrop"),this.backdrop.addEventListener("click",this.close),this.connected();}};var a=class extends e{constructor(t,s,o){super(o);this.confirm=()=>{this.resolve(),this.remove();};this.cancel=()=>{this.reject(),this.remove();};this.settings=t,this.resolve=s,this.render();}render(){this.className=this.settings.className,this.innerHTML=`
			<div class="backdrop"></div>
			<div class="modal" size="${this.settings.size}">
				<h1>${this.settings.heading}</h1>
				<p>${this.settings.message}</p>
				<div class="actions">
					<button class="cancel">
						${this.settings.rejectLabel}
					</button>
					<button class="confirm ${this.settings.dangerous?"danger":""}">
						${this.settings.confirmLabel}
					</button>
				</div>
				<button class="close" aria-label="close modal">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		`;}connected(){this.confirmButton=this.querySelector(".confirm"),this.confirmButton.addEventListener("click",this.confirm),this.cancelButton=this.querySelector(".cancel"),this.cancelButton.addEventListener("click",this.cancel);}};var r=class extends e{constructor(t,s,o){super(o);this.submit=t=>{t.preventDefault(),this.settings.form.checkValidity()?(this.resolve(new FormData(this.settings.form)),this.remove()):this.settings.form.reportValidity();};this.settings=t,this.resolve=s,this.render();}render(){this.className=this.settings.className,this.innerHTML=`
			<div class="backdrop"></div>
			<div class="modal" size="${this.settings.size}">
				${this.settings.heading?.length?`<h1>${this.settings.heading}</h1>`:""}
				${this.settings.message?.length?`<p>${this.settings.message}</p>`:""}
				<div class="form"></div>
				<button class="close" aria-label="close modal">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		`;}connected(){this.settings.form instanceof HTMLFormElement&&(this.form=this.querySelector(".form"),this.form.appendChild(this.settings.form),this.settings.form.addEventListener("submit",this.submit));}};var l=class extends e{constructor(t){super();this.settings=t,this.render();}render(){this.className=this.settings.className,this.innerHTML=`
			<div class="backdrop"></div>
			<div class="modal" size="${this.settings.size}">
				<h1>${this.settings.heading}</h1>
				<p>${this.settings.message}</p>
				<button class="close" aria-label="close modal">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		`;}};var c=class extends e{constructor(t){super();this.settings=t,this.render();}render(){this.className=this.settings.className,this.innerHTML=`
			<div class="backdrop"></div>
			<div class="modal" size="${this.settings.size}">
				${this.settings.heading?.length?`<h1>${this.settings.heading}</h1>`:""}
				${this.settings.message?.length?`<p>${this.settings.message}</p>`:""}
				<div class="container">
					${this.settings.el instanceof HTMLElement?"":this.settings.el}
				</div>
				<button class="close" aria-label="close modal">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		`;}connected(){this.settings.el instanceof HTMLElement&&this.querySelector(".container").appendChild(this.settings.el);}};var d=class{constructor(){this.modal=null;}launch(t){this.modal?.isConnected&&(this.modal.reject(),this.modal.remove()),this.modal=t,document.body.appendChild(this.modal);}passive(t){let s=Object.assign({className:"",heading:"Heading",message:"Passive modals require a message.",size:"small"},t);this.launch(new l(s));}confirm(t){return new Promise((s,o)=>{let m=Object.assign({className:"",heading:"Heading",message:"Confirm modals require a message.",size:"small",confirmLabel:"Confirm",rejectLabel:"Cancel",dangerous:!1},t);this.launch(new a(m,s,o));})}form(t){return new Promise((s,o)=>{let m=Object.assign({className:"",heading:null,message:null,size:"medium",form:null},t);this.launch(new r(m,s,o));})}raw(t){let s=Object.assign({className:"",heading:null,message:null,size:"large",el:null},t);this.launch(new c(s));}};var i=new d,g=i.passive.bind(i),p=i.confirm.bind(i),u=i.form.bind(i),v=i.raw.bind(i);customElements.define("passive-modal",l);customElements.define("confirm-modal",a);customElements.define("form-modal",r);customElements.define("raw-modal",c);

export { p as confirm, u as form, g as passive, v as raw };
