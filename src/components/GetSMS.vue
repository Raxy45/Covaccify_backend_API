<template>
  <div>
    <v-col cols="auto">
      <v-dialog transition="dialog-bottom-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-container>
            <p v-if="displaySorry">
              No Centers available in your area :( <br />Want to get Notified
              when the centers are available ?! <br />
              Well just fill out the form below , we'll reach out to you via
              Email and Whatsapp
            </p>
            <v-form>
              <v-text-field v-model="name" label="Name" required></v-text-field>
              <v-text-field
                v-model="number"
                :rules="numberRules"
                :counter="10"
                label="Number"
                required
              ></v-text-field>
              <v-text-field
                v-model="pincode"
                :counter="6"
                label="Pincode"
                required
              ></v-text-field>
              <v-text-field
                v-model="email"
                label="Email"
                :rules="emailRules"
                required
              ></v-text-field>
              <v-select
                v-model="minimumAge"
                :items="['18', '45']"
                :rules="[(v) => !!v || 'Age is required']"
                label="Select Minimum Age"
                required
              ></v-select>

              <v-btn
                color="green white--text"
                block
                @click="postToSMSAPI"
                v-bind="attrs"
                v-on="on"
              >
                Submit
              </v-btn>
            </v-form>
          </v-container>
        </template>
        <template v-slot:default="dialog">
          <v-card v-if="userAddedSuccessfully == 200">
            <v-toolbar color="green" dark
              >Thank You for registering {{ name }}</v-toolbar
            >
            <v-card-text>
              <div class="text-h6 pa-12 pl-0">
                We'll reach you out by Email and Whatsapp as soon as we find
                vaccines at pincode {{ pincode }}
              </div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="dialog.value = false">Close</v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-else-if="userAddedSuccessfully == 201">
            <v-toolbar color="green" dark
              >Sorry {{ name }} , It appears that you haven't filled up the
              complete form</v-toolbar
            >
            <v-card-text>
              <div class="text-h6 pa-12 pl-0">
                Please fill all the essential entries to get started
              </div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="dialog.value = false">Close</v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-if="userAddedSuccessfully == 404">
            <v-toolbar color="green" dark>Sorry {{ name }}</v-toolbar>
            <v-card-text>
              <div class="text-h6 pa-12 pl-0">
                It appears something's wrong on server side
              </div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="dialog.value = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
export default {
  name: "getSMS",
  props: ["displaySorry"],
  data() {
    return {
      number: "",
      name: "",
      pincode: "",
      minimumAge: "",
      email: "",
      numberRules: [
        (v) => !!v || "Phone Number is required",
        (v) =>
          (v && v.length <= 10) || "Number must be less than 10 characters",
      ],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@gmail.com+/.test(v) || "E-mail must be valid",
      ],
      userAddedSuccessfully: 0,
    };
  },
  methods: {
    postToSMSAPI() {
      if (
        this.name &&
        this.number.length == 10 &&
        this.email &&
        this.pincode.length == 6 &&
        this.minimumAge
      ) {
        axios({
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          url: "https://vaccifybackend.herokuapp.com/addUser",
          data: qs.stringify({
            name: this.name,
            number: this.number,
            email: this.email,
            pincode: this.pincode,
            minimumAge: this.minimumAge,
          }),
        })
          .then((dataFromAPI) => {
            this.userAddedSuccessfully = 200;
            console.log("User added to Database successfully" + dataFromAPI);
          })
          .catch((err) => {
            this.userAddedSuccessfully = 404;
            console.log(err + "OP OP");
          });
      } else {
        this.userAddedSuccessfully = 201;
        console.log("Something is missing");
      }
    },
  },
};
</script>
