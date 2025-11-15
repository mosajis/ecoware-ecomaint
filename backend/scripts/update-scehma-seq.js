export const sequenceMap = {
  TblAddress: [
    {
      field: "addressId",
      replacement:
        'addressId Int @id(map: "PK_tblAddress") @default(dbgenerated("NEXT VALUE FOR [Seq_Address]"), map: "DF_tbladdress_ID") @map("AddressID")',
    },
  ],
  TblLocation: [
    {
      field: "locationId",
      replacement:
        'locationId Int @id(map: "PK_tblLocation") @default(dbgenerated("NEXT VALUE FOR [Seq_Location]"), map: "DF_tbllocation_ID") @map("LocationID")',
    },
  ],
};
