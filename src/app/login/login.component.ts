import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { fuseAnimations } from '@fuse/animations';
// import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
// import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  currentImageIndex = 0;
  images = ["images/1.jpeg", "images/2.jpeg", "images/3.jpeg", "images/4.jpeg"];
  imageTexts = ["Battery", "ELECTRONICS", "DEFENCE", "EMOBLITY"];
  @ViewChild("signInNgForm") signInNgForm: NgForm;

  // alert: { type: FuseAlertType; message: string } = {
  //   type: "success",
  //   message: "",
  // };
  signInForm: UntypedFormGroup;
  showAlert: boolean = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    // private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      email: [
        "bala@sharviinfotech.com",
        [Validators.required, Validators.email],
      ],
      password: ["1234", Validators.required],
      rememberMe: [""],
    });
    this.autoChangeImageAndText();
  }

  // signIn(): void {
  //   if (this.signInForm.invalid) {
  //     return;
  //   }

  //   this.signInForm.disable();
  //   this.showAlert = false;

  //   this._authService.signIn(this.signInForm.value).subscribe(
  //     () => {
  //       const redirectURL =
  //         this._activatedRoute.snapshot.queryParamMap.get("redirectURL") ||
  //         "/signed-in-redirect";
  //       this._router.navigateByUrl(redirectURL);
  //     },
  //     (response) => {
  //       this.signInForm.enable();
  //       this.signInNgForm.resetForm();

  //       this.alert = {
  //         type: "error",
  //         message: "Wrong email or password",
  //       };

  //       this.showAlert = true;
  //     }
  //   );
  // }

  autoChangeImageAndText() {
    const intervalTime = 5000; // Time between transitions (5 seconds)

    setInterval(() => {
      const images = document.querySelectorAll(".background-img");
      const textContainer = document.querySelector(
        ".dynamic-text"
      ) as HTMLElement;

      // Remove 'active' class from the current image
      images[this.currentImageIndex].classList.remove("active");

      // Change to the next image
      this.currentImageIndex = (this.currentImageIndex + 1) % images.length;

      // Add 'active' class to the new image
      images[this.currentImageIndex].classList.add("active");

      // Change the dynamic text to match the current image
      textContainer.textContent = this.imageTexts[this.currentImageIndex];

      // Reset and reapply the text reveal animation
      textContainer.classList.remove("intro-reveal");
      setTimeout(() => {
        textContainer.classList.add("intro-reveal");
      }, 10); // Delay for the animation reset
    }, intervalTime);
  }
}
