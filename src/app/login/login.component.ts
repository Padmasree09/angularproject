// import { Component, OnInit, ViewChild } from "@angular/core";
// import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
// import { Router } from "@angular/router";
// // import { fuseAnimations } from '@fuse/animations';
// // import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
// // import { AuthService } from 'app/core/auth/auth.service';

// @Component({
//   selector: "app-login",
//   templateUrl: "./login.component.html",
//   styleUrls: ["./login.component.scss"],
// })
// export class LoginComponent implements OnInit {
//   currentImageIndex = 0;
//   images = [
//     "/assets/img/image_1.png",
//     "/assets/img/image_2.png",
//     "/assets/img/image_3.png",
//     "/assets/img/image_4.png",
//   ];
//   imageTexts = [
//     "Ramky Infrastructure",
//     "Ramky Estates and Farms",
//     "Ramky Foundation",
//     "Smilax Laboratories",
//   ];
//   @ViewChild("signInNgForm") signInNgForm: NgForm;

//   // alert: { type: FuseAlertType; message: string } = {
//   //   type: "success",
//   //   message: "",
//   // };
//   // signInForm: UntypedFormGroup;
//   showAlert: boolean = false;

//   // constructor(
//   //   private _activatedRoute: ActivatedRoute,
//   //   // private _authService: AuthService,
//   //   private _formBuilder: UntypedFormBuilder,
//   //   private _router: Router
//   // ) {}
//   constructor(private fb: FormBuilder, private router: Router) {
//     this.signInForm = this.fb.group({
//       ZUSER: ["", Validators.required], // Username
//       ZPASSWORD: ["", Validators.required], // Password
//     });
//   }
//   ngOnInit(): void {
//     this.signInForm = this.formBuilder.group({
//       email: [
//         "bala@sharviinfotech.com",
//         [Validators.required, Validators.email],
//       ],
//       password: ["1234", Validators.required],
//       rememberMe: [""],
//     });
//     this.autoChangeImageAndText();
//   }
//   signInForm: FormGroup;

//   // Method triggered on form submission
//   onSubmit() {
//     if (this.signInForm.valid) {
//       const username = this.signInForm.get("ZUSER")?.value;
//       const password = this.signInForm.get("ZPASSWORD")?.value;

//       // Replace this part with your actual authentication logic
//       if (username && password) {
//         // Navigate to the dashboard page after successful login
//         this.router.navigate(["/dashboard"]);
//       } else {
//         // You can show an error message here
//         alert("Please enter valid username and password.");
//       }
//     } else {
//       // You can show an error message if the form is invalid
//       alert("Form is not valid. Please fill in all required fields.");
//     }
//   }

//   // signIn(): void {
//   //   if (this.signInForm.invalid) {
//   //     return;
//   //   }

//   //   this.signInForm.disable();
//   //   this.showAlert = false;

//   //   this._authService.signIn(this.signInForm.value).subscribe(
//   //     () => {
//   //       const redirectURL =
//   //         this._activatedRoute.snapshot.queryParamMap.get("redirectURL") ||
//   //         "/signed-in-redirect";
//   //       this._router.navigateByUrl(redirectURL);
//   //     },
//   //     (response) => {
//   //       this.signInForm.enable();
//   //       this.signInNgForm.resetForm();

//   //       this.alert = {
//   //         type: "error",
//   //         message: "Wrong email or password",
//   //       };

//   //       this.showAlert = true;
//   //     }
//   //   );
//   // }

//   autoChangeImageAndText() {
//     const intervalTime = 5000; // Time between transitions (5 seconds)

//     setInterval(() => {
//       const images = document.querySelectorAll(".background-img");
//       const textContainer = document.querySelector(
//         ".dynamic-text"
//       ) as HTMLElement;

//       // Remove 'active' class from the current image
//       images[this.currentImageIndex].classList.remove("active");

//       // Change to the next image
//       this.currentImageIndex = (this.currentImageIndex + 1) % images.length;

//       // Add 'active' class to the new image
//       images[this.currentImageIndex].classList.add("active");

//       // Change the dynamic text to match the current image
//       textContainer.textContent = this.imageTexts[this.currentImageIndex];

//       // Reset and reapply the text reveal animation
//       textContainer.classList.remove("intro-reveal");
//       setTimeout(() => {
//         textContainer.classList.add("intro-reveal");
//       }, 10); // Delay for the animation reset
//     }, intervalTime);
//   }
// }

import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  currentImageIndex = 0;
  images = [
    "/assets/img/image.png",
    "/assets/img/image2_new.png",
    "/assets/img/image3_new.png",
    "/assets/img/image4_new.png",
  ];
  imageTexts = [
    "Ramky Infrastructure",
    "Ramky Estates and Farms",
    "Ramky Foundation",
    "Smilax Laboratories",
  ];

  signInForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      ZUSER: ["", Validators.required],
      ZPASSWORD: ["", Validators.required],
    });
    this.autoChangeImageAndText();
  }

  onSubmit() {
    if (this.signInForm.valid) {
      const username = this.signInForm.get("ZUSER")?.value;
      const password = this.signInForm.get("ZPASSWORD")?.value;

      // Placeholder for authentication logic
      if (username && password) {
        // Navigate to the dashboard page after successful login
        this.router.navigate(["/dashboard"]);
      } else {
        // Show an error message
        alert("Please enter a valid username and password.");
      }
    } else {
      // Show an error message if the form is invalid
      alert("Form is not valid. Please fill in all required fields.");
    }
  }

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
