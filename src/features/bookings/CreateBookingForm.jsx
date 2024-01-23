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
import FormSelect from "../../ui/FormSelect";
import FormSelectOptions from "../../ui/FormSelectOptions";

function CreateCabinForm({ bookingToEdit = {}, onCloseModal }) {
  const { createBooking, isCreating } = useCreateBooking();
  const { cabins: apiCabins, isLoading: isLoadingCabins } = useCabins();
  const { guests: apiGuests, isLoading: isLoadingGuests } = useGuests();
  // const { isEditing, editCabin } = useEditCabin();
  const isWorking = isCreating || isLoadingCabins || isLoadingGuests;

  const { id: editId, ...editValues } = bookingToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState, setValue } =
    useForm({
      defaultValues: isEditSession ? editValues : {},
    });
  const { errors } = formState;

  const cabins = apiCabins
    ? apiCabins.map((cabin) => {
        return {
          label: `${cabin.name} - Max: ${cabin.maxCapacity}`,
          value: cabin.id,
        };
      })
    : [];
  const guests = apiGuests
    ? apiGuests.map((guest) => {
        return { label: guest.fullName, value: guest.id };
      })
    : [];

  function onSubmit(data) {
    console.log(data);
    // createBooking(data, {
    //   onSuccess: () => {
    //     reset();
    //     onCloseModal?.();
    //   },
    // });
  }

  function onError(errors) {
    // console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Start Date" error={errors?.startDate?.message}>
        <Input
          id="startDate"
          {...register("startDate", {
            required: "This field is required",
          })}
          type="date"
          disabled={isWorking}
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

      <FormRow label="End Date" error={errors?.endDate?.message}>
        <Input
          id="endDate"
          {...register("endDate", {
            required: "This field is required",
          })}
          type="date"
          disabled={isWorking}
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

      <FormRow label="Number of nights" error={errors?.numNights?.message}>
        <Input
          id="numNights"
          {...register("numNights", {
            required: "This field is required",
          })}
          type="number"
          disabled
        />
      </FormRow>

      <FormRow label="Guest" error={errors?.guestId?.message}>
        <FormSelect
          disabled={isWorking}
          {...register("guestId", {
            required: "This field is required",
          })}
        >
          <FormSelectOptions options={guests} />
        </FormSelect>
      </FormRow>

      <FormRow label="Number of guests" error={errors?.numGuests?.message}>
        <Input
          id="numGuests"
          disabled={isWorking}
          {...register("numGuests", {
            required: "This field is required",
          })}
          onChange={(e) => {}}
          type="number"
        />
      </FormRow>

      <FormRow label="Cabin" error={errors?.cabinId?.message}>
        <FormSelect
          disabled={isWorking}
          {...register("cabinId", {
            required: "This field is required",
          })}
        >
          <FormSelectOptions options={cabins} />
        </FormSelect>
      </FormRow>

      <FormRow label="Add Breakfast">
        <input
          disabled={isWorking}
          type="checkbox"
          {...register("hasBreakfast")}
        />
      </FormRow>

      <FormRow label="Cabin Price" error={errors?.cabinPrice?.message}>
        <Input
          id="cabinPrice"
          disabled={isWorking}
          {...register("cabinPrice", {
            required: "This field is required",
          })}
          type="number"
        />
      </FormRow>

      <FormRow label="Extras Price" error={errors?.extrasPrice?.message}>
        <Input
          id="extrasPrice"
          disabled={isWorking}
          {...register("extrasPrice", {
            required: "This field is required",
          })}
          type="number"
        />
      </FormRow>

      <FormRow label="Total Price" error={errors?.totalPrice?.message}>
        <Input
          id="totalPrice"
          disabled={isWorking}
          {...register("totalPrice", {
            required: "This field is required",
          })}
          type="number"
        />
      </FormRow>

      <FormRow label="Status" error={errors?.status?.message}>
        <FormSelect
          disabled={isWorking}
          {...register("status", {
            required: "This field is required",
          })}
        >
          <FormSelectOptions options={STATUSES} />
        </FormSelect>
      </FormRow>

      <FormRow label="Is paid">
        <input disabled={isWorking} type="checkbox" {...register("isPaid")} />
      </FormRow>

      <FormRow label="Notes" error={errors?.observations?.message}>
        <Textarea disabled={isWorking} {...register("observations")} />
      </FormRow>

      <FormRow>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit booking" : "Create new booking"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
