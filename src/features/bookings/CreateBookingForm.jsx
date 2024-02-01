import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import { differenceInDays } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { useCabins } from "../cabins/useCabins";
import { useCreateBooking } from "./useCreateBooking";

import DatePicker from "react-multi-date-picker";
import FormSelect from "../../ui/FormSelect";
import FormSelectOptions from "../../ui/FormSelectOptions";
import Textarea from "../../ui/Textarea";
import { STATUSES } from "../../utils/constants";
import { useGuests } from "./useGuests";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";

function CreateCabinForm({ bookingToEdit = {}, onCloseModal }) {
  const { createBooking, isCreating } = useCreateBooking();
  const { cabins: apiCabins, isLoading: isLoadingCabins } = useCabins();
  const { guests: apiGuests, isLoading: isLoadingGuests } = useGuests();
  // const { isEditing, editCabin } = useEditCabin();
  const isWorking = isCreating || isLoadingCabins || isLoadingGuests;

  const { id: editId, ...editValues } = bookingToEdit;
  const isEditSession = Boolean(editId);

  const { register, control, handleSubmit, reset, formState, setValue } =
    useForm({
      defaultValues: isEditSession
        ? editValues
        : {
            guestId: "",
            cabinId: "",
            status: "",
            duration: [],
          },
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
    data["startDate"] = new Date(data.duration[0]).toISOString();
    data["endDate"] = new Date(data.duration[1]).toISOString();
    delete data.duration;
    createBooking(data, {
      onSuccess: () => {
        reset();
        onCloseModal?.();
      },
    });
  }

  // function onError(errors) {
  //   // console.log(errors);
  // }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Duration" error={errors?.duration?.message}>
        <Controller
          control={control}
          name="duration"
          rules={{
            required: "This field is required",
            validate: (arrayOfDates) =>
              arrayOfDates.length === 2 || "Please choose a valid date range",
          }}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              value={value}
              hideOnScroll
              onChange={(datesArray) => {
                if (datesArray?.length === 2) {
                  onChange(datesArray);
                  setValue(
                    "numNights",
                    differenceInDays(
                      new Date(datesArray.at(1)),
                      new Date(datesArray.at(0))
                    )
                  );
                } else if (datesArray?.length === 0) {
                  onChange([]);
                  setValue("numNights", "");
                }
              }}
              range
              rangeHover
              sort
              numberOfMonths={2}
              format="DD/MM/YYYY"
              plugins={[<DatePanel key={1} />]}
              style={{
                fontSize: "1.4rem",
                height: "4rem",
                width: "21.5rem",
                padding: "0.8rem 1.2rem",
                border: "1px solid var(--color-grey-300)",
                borderRadius: "var(--border-radius-sm)",
                backgroundColor: "var(--color-grey-0)",
                fontWeight: "500",
                boxShadow: "var(--shadow-sm)",
              }}
              calendarPosition="bottom"
              minDate={new Date()}
              className="bg-dark"
              editable={false}
              dateSeparator=" - "
              disabled={isWorking}
            />
          )}
        />
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

      <FormRow hasButton={true}>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit booking" : "Create new booking"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
