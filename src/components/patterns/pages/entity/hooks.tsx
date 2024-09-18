import React from "react";
import { EntityPage, useEntity, useEntityPage } from "@wix/patterns";
import { Breadcrumbs, Card } from "@wix/design-system";
import { useParams } from "react-router-dom";
import { httpClient } from "@wix/essentials";
import { useForm } from "@wix/patterns/form";
import { Jewel } from "../../../../types";
import { useNavigate } from "react-router-dom";

type EntityPageFormFields = {
  name: string;
  updatedDate: Date;
  createdDate: Date;
};

export const useJewelEntityPage = () => {
  const params = useParams();
  const form = useForm<EntityPageFormFields>();
  const navigate = useNavigate();

  const state = useEntityPage<Jewel, EntityPageFormFields>({
    parentPath: "/",
    parentPageId: "",
    form,
    onSave: async (data) => {
      const formValues = form.getValues();
      // TODO: save the entity
      navigate("/");
      return await new Promise((resolve) =>
        resolve({ updatedEntity: {} as Jewel })
      );
    },
    saveSuccessToast: "Successfully saved",
    saveErrorToast: (e) => "Failed to save",
    fetch: async () => {
      // TODO: Load the entity you want to show in the page
      const res = await httpClient.fetchWithAuth(
        `${import.meta.env.BASE_API_URL}/jewels?id=${
          params.entityId ?? "m9l0wp"
        }`
      );
      const entity = (await res.json()) as Jewel;
      return { entity };
    },
  });
  const entity = useEntity(state);
  return {
    state,
    entity,
  };
};

export const useJewelEntityPageHeader = ({
  entity,
}: {
  entity: Jewel | null;
}) => {
  const navigate = useNavigate();
  return (
    <EntityPage.Header
      title={{ text: entity?.title || "New Entity" }}
      subtitle={
        entity
          ? {
              text: `Jewel ID: ${entity.id}`,
              learnMore: {
                url: "https://www.wix.com/",
              },
            }
          : undefined
      }
      breadcrumbs={
        <Breadcrumbs
          activeId="current"
          items={[
            { id: "root", value: "Dummy Entity Collection" },
            { id: "current", value: "Entity Page" },
          ]}
          onClick={(e) => {
            if (e.id === "root") {
              navigate("/");
            }
          }}
        />
      }
    />
  );
};
export const useJewelEntityPageContent = ({
  entity,
}: {
  entity: Jewel | null;
}) => {
  return (
    <EntityPage.Content>
      <EntityPage.MainContent>
        <EntityPage.Card minHeight="204px" dataHook="entity-page-card">
          <Card.Header
            title="Main Data"
            subtitle="General information about the product"
          />
          <Card.Divider />
          <Card.Content>dataaa</Card.Content>
        </EntityPage.Card>
      </EntityPage.MainContent>
    </EntityPage.Content>
  );
};
