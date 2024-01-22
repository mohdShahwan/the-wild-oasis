import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import { differenceInDays } from "date-fns";
import { useForm } from "react-hook-form";
import { useCabins } from "../cabins/useCabins";
import { useCreateBooking } from "./useCreateBooking";

import "react-datepicker/dist/react-datepicker.css";
import Textarea from "../../ui/Textarea";
import { STATUSES } from "../../utils/constants";
import { useGuests } from "./useGuests";

function CreateCabinForm({ bookingToEdit = {}, onCloseModal }) {
  const { createBooking, isCreating } = useCreateBooking();
  const { cabins: apiCabins, isLoading: isLoadingCabins } = useCabins();
  const { guests: apiGuests, isLoading: isLoadingGuests } = useGuests();
  // const { isEditing, editCabin } = useEditCabin();
  // const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = bookingToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState, setValue } =
    useForm({
      defaultValues: isEditSession ? editValues : {},
    });
  const { errors } = formState;

  const cabins = apiCabins
    ? apiCabins.map((cabin) => {
        return { label: cabin.name, value: cabin.id };
      })
    : [];
  const guests = apiGuests
    ? apiGuests.map((guest) => {
        return { label: guest.fullName, value: guest.id };
      })
    : [];

  function onSubmit(data) {
    console.log(data);
    createBooking(data, {
      onSuccess: () => {
        reset();
        onCloseModal?.();
      },
    });
  }

  function onError(errors) {
    // console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Start Date">
        <Input
          id="startDate"
          {...register("startDate", {
            required: "This field is required",
          })}
          type="date"
          onChange={(e) =>
            setValue(
              "numNights",
              differenceInDays(
                new Date(getValues().endDate),
                new Date(e.target.value)
              )
            )
          }
        />
        {/* <DatePicker dateFormat='DD/MM/YYYY'  /> */}
      </FormRow>

      <FormRow label="End Date">
        <Input
          id="endDate"
          {...register("endDate", {
            required: "This field is required",
          })}
          type="date"
          onChange={(e) =>
            setValue(
              "numNights",
              differenceInDays(
                new Date(e.target.value),
                new Date(getValues().startDate)
              )
            )
          }
        />
        {/* <DatePicker dateFormat='DD/MM/YYYY'  /> */}
      </FormRow>

      <FormRow label="Number of nights">
        <Input
          id="numNights"
          {...register("numNights", {
            required: "This field is required",
          })}
          type="number"
          disabled
        />
      </FormRow>

      <FormRow label="Number of guests">
        <Input
          id="numGuests"
          {...register("numGuests", {
            required: "This field is required",
          })}
          type="number"
        />
      </FormRow>

      <FormRow label="Add Breakfast">
        <input
          type="checkbox"
          {...register("hasBreakfast", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Cabin Price">
        <Input
          id="cabinPrice"
          {...register("cabinPrice", {
            required: "This field is required",
          })}
          type="number"
        />
      </FormRow>

      <FormRow label="Extras Price">
        <Input
          id="extrasPrice"
          {...register("extrasPrice", {
            required: "This field is required",
          })}
          type="number"
        />
      </FormRow>

      <FormRow label="Total Price">
        <Input
          id="totalPrice"
          {...register("totalPrice", {
            required: "This field is required",
          })}
          type="number"
        />
      </FormRow>

      <FormRow label="Status">
        {/* <Select options={STATUSES} {...register("status")} /> */}
        <select
          {...register("status", {
            required: "This field is required",
          })}
        >
          {STATUSES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormRow>

      <FormRow label="Is paid">
        <input
          type="checkbox"
          {...register("isPaid", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Notes">
        <Textarea {...register("observations")} />
      </FormRow>

      <FormRow label="Cabin">
        {/* <Select options={STATUSES} {...register("status")} /> */}
        <select
          {...register("cabinId", {
            required: "This field is required",
          })}
        >
          {cabins.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormRow>

      <FormRow label="Guest">
        {/* <Select options={STATUSES} {...register("status")} /> */}
        <select
          {...register("guestId", {
            required: "This field is required",
          })}
        >
          {guests.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormRow>

      <FormRow>
        <Button>{isEditSession ? "Edit booking" : "Create new booking"}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
