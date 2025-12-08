import pandas as pd
import pymupdf as pymdf
from typing import Literal



TRANSACTION_TYPE_CHOICES = (
    ('debit', 'Debit'),
    ('credit', 'Credit'),
)   

DEBIT_CATEGORY_CHOICES = (
    ('bills', 'Bills'),
    ('wants', 'Wants'),
    ('needs', 'Needs'),
)


def convert_to_expenso_df(statement : pd.DataFrame, bank : str = "sbi"):
    
    if statement is not None:

        df = statement.copy()
        if bank =='sbi':

            tbd_features = ['Ref No./Cheque\nNo']
            df = df.drop(tbd_features,axis=1)
            df = df.replace('-', pd.NA)


            df[['txn_details','txn_type','txn_id','sr_details']] = df['Details'].str.split('/',n=3,expand=True)
            df['transaction_date'] = pd.to_datetime(df['Date'].str.lower(),format="%d %b %Y")

            df['transaction_type'] = 'credit'
            df['transaction_type'] = df['transaction_type'].where(df['Debit'].isna(), 'debit')

            df['transaction_amount'] = df['Debit'].combine_first(df['Credit'])

            df['payer_name'] = df['sr_details'].apply(lambda x: x.replace("\n"," ").replace("/","_") if x is not None else x)
            df['payer_name'] = df['payer_name'].fillna(df['txn_details'])

            df['remarks'] = df.apply(lambda x: f"{x.txn_id}_{x.txn_details}" if pd.notnull(x.txn_id) and pd.notnull(x.txn_details) else None,axis=1)            
            
            df['debit_category'] = "wants"
            df['sub_category'] = "test"
            
            return df

    else:
        raise Exception('Cannot convert an empty statement !')




def get_sbi_statement_df(document_path : str) -> pd.DataFrame:

    document = pymdf.open(document_path)
    statement_df = None
    for page in document.pages():
        table = page.find_tables()
        if table:
            if statement_df is not None:
                statement_df = pd.concat([statement_df,table.tables[0].to_pandas()],ignore_index=True)
            else:
                statement_df = table.tables[0].to_pandas()
    return statement_df